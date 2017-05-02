from pymongo import MongoClient
import pprint
import re

import csv, math
from nltk.tokenize import RegexpTokenizer
import nltk
from nltk.corpus import stopwords


def get_category(text, phi, vocas):

    labels = ['common', 'business', 'entertainment', 'us', 'health', 'sci_tech', 'world', 'sport']

    # lower case
    text = text.lower()

    # remove punctuation
    tokenizer = RegexpTokenizer(r'\w+')
    text = tokenizer.tokenize(text)

    #stop words
    filter_reviews = [w for w in text if not w in stopwords.words('english')]

    #stemmer
    stemmer = nltk.stem.snowball.EnglishStemmer()
    text_arr = [stemmer.stem(word) for word in filter_reviews]

    num_label = len(phi)

    prob_arr = []

    for i in range(num_label):
        prob_arr.append(0)

    for word in text_arr:
        if word in vocas:
            # print word
            index = vocas.index(word)
            for i in range(num_label):
                prob_arr[i] = prob_arr[i] + abs(math.log(float(phi[i][index])))
                # print phi[i][index]

    prob_arr[0] = (prob_arr[0] + 1) * 1000

    return labels[prob_arr.index(min(prob_arr))]


if __name__ == "__main__":
    phi = []
    vocas = []

    with open('./llda_classifier/data/vocas.csv', 'rb') as file:
        csv_file = csv.reader(file)
        for row in csv_file:
            for i in range(len(row)):
                vocas.append(row[i])

    with open('./llda_classifier/data/phi.csv', 'rb') as file:
        csv_file = csv.reader(file)
        for row in csv_file:
            phi.append(row)

    client = MongoClient()
    client = MongoClient('localhost', 27017)

    db = client['admin']
    tweets = db.Tweets

    db.Categories.delete_many({})

    # print db.collection_names(include_system_collections=False)
    # pprint.pprint(tweets.find_one())

    inverted_index = {'entertainment': [],
                      'us': [],
                      'sport': [],
                      'sci_tech': [],
                      'world': [],
                      'health': [],
                      'business': []}

    for tweet in tweets.find():
        tweet_text = tweet['tweet_content']['text']
        # pprint.pprint(tweet_text)
        tweet_text = ' '.join(re.sub("([^0-9A-Za-z \t])|(\w+:\/\/\S+)|(RT)|([0-9]+)", " ", tweet_text).split())
        category = get_category(tweet_text, phi, vocas)
        inverted_index[category].append(tweet['tweet_content']['id_str'])

    # print pprint.pprint(inverted_index)
    db.Categories.insert_one(inverted_index)

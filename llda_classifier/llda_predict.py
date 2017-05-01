import csv, math
from nltk.tokenize import RegexpTokenizer
import nltk
from nltk.corpus import stopwords


phi = []
vocas = []

with open('data/vocas.csv', 'rb') as file:
    csv_file = csv.reader(file)
    for row in csv_file:
        for i in range(len(row)):
            vocas.append(row[i])

with open('data/phi.csv', 'rb') as file:
    csv_file = csv.reader(file)
    for row in csv_file:
        phi.append(row)

text = 'You cant compare anything to ObamaCare because ObamaCare is dead. Dems want billions to go to Insurance Companies to bail out donors....New'

def get_category(text, phi, vocas):
    #lower case
    labels = ['common', 'business', 'entertainment', 'us', 'health', 'sci_tech', 'world', 'sport']
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

    prob_arr[0] = prob_arr[0] * 1.4

    return labels[prob_arr.index(min(prob_arr))]


print get_category(text, phi, vocas)

# text = 'You cant compare anything to ObamaCare because ObamaCare is dead. Dems want billions to go to Insurance Companies to bail out donors....New'




# text_arr = text.split()
# for i in range(len(text_arr)):
#     text_arr[i] = text_arr[i].lower()

# print text_arr

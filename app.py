import pandas as pd
import numpy as np
import pickle

from sklearn import cross_validation, datasets, tree, preprocessing
from sklearn.model_selection import train_test_split
from sklearn import svm
from sklearn.pipeline import Pipeline
from sklearn import metrics

from flask import Flask, request

from StringIO import StringIO

"""
    To run a flask server just type into your terminal

    FLASK_APP=app.py
    flask run
    
"""

app = Flask(__name__)                                       

"""
    1.Read in your data
    2.Set your x and y variables 
    3.Split you data
    4.Define and train your model
    5.return your prediction

"""

def model(prediction):
    import pandas as pd
    import numpy as np
    import matplotlib as plt
    import pickle

    from numpy.random import seed

    from sklearn import cross_validation, datasets, tree, preprocessing
    from sklearn.model_selection import train_test_split, KFold, cross_val_score, cross_val_predict
    from sklearn import svm
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline
    from sklearn import metrics

    from keras.models import Sequential
    from keras.layers import Dense, Convolution1D, Activation, Flatten
    from keras.wrappers.scikit_learn import KerasClassifier

    from flask import Flask, request


    titanic_df = pd.read_csv('titanic_dataset.csv')


    titanic_df = titanic_df.drop(columns=['cabin', 'boat', 'body', 'home.dest'])


    titanic_df = titanic_df.dropna(axis=0)

    processed_titanic_df = titanic_df.copy()

    label_enc = preprocessing.LabelEncoder()

    processed_titanic_df.sex = label_enc.fit_transform(processed_titanic_df.sex)
    processed_titanic_df.embarked = label_enc.fit_transform(processed_titanic_df.embarked)

    processed_titanic_df = processed_titanic_df.drop(columns=['name', 'ticket'])


    processed_titanic_df.to_csv('processed_titanic.csv')

    x = processed_titanic_df.drop(columns=['survived'])
    y = processed_titanic_df['survived'].values

    x_train, x_val, y_train, y_val = train_test_split(x, y, test_size=0.2)


    decision_tree = tree.DecisionTreeClassifier(max_depth = 8, random_state=1)

    decision_tree.fit(x_train, y_train)

    return str(decision_tree.predict(prediction)[0])

    
@app.route("/predict", methods=["POST"])                    # YOU CAN CHANGE THIS TO SUIT YOUR METHODS
def predict():
    print("getting record...")
    record = np.zeros((1, 7))
    initialReq = request.data                               # request.data is getting the data you are sending from your index.js
    print("INITIAL REQUEST: {}".format(initialReq))
    initialReq = initialReq.split(',')                      # this is how I seperated the numbers into a string array
    print("RECORD BEFORE: {}".format(initialReq))
    record[0] = map(int, initialReq)                        # this is how I converted my string numbers into ints
    print("RECORD AFTER: {}".format(record))
    return model(record)                                    # I then returned the prediction which the model fucntion did for me

if __name__ == '__main__':
    app.run(debug=True)

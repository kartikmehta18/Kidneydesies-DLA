from flask import Flask, request, jsonify, render_template
import os
from flask_cors import CORS, cross_origin
import base64
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Setup env
os.putenv('LANG', 'en_US.UTF-8')
os.putenv('LC_ALL', 'en_US.UTF-8')

app = Flask(__name__)
CORS(app)

# Load trained model
MODEL_PATH = "model/model.h5"
model = load_model(MODEL_PATH, compile=False)

# Classes
CLASS_NAMES = ["Normal", "Tumor"]

def decodeImage(imgstring, fileName):
    """Decode base64 string to image file"""
    imgdata = base64.b64decode(imgstring)
    with open(fileName, 'wb') as f:
        f.write(imgdata)

class PredictionPipeline:
    def __init__(self, filename):
        self.filename = filename

    def predict(self):
        # Preprocess image
        img = image.load_img(self.filename, target_size=(224, 224))  # ❗ Change if trained with different size
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # ❗ Ensure same scaling as training

        # Predict
        preds = model.predict(img_array)
        predicted_class = CLASS_NAMES[np.argmax(preds)]

        return predicted_class


class ClientApp:
    def __init__(self):
        self.filename = "inputImage.jpg"
        self.classifier = PredictionPipeline(self.filename)


@app.route("/", methods=['GET'])
@cross_origin()
def home():
    return render_template('index.html')


@app.route("/train", methods=['GET', 'POST'])
@cross_origin()
def trainRoute():
    os.system("python main.py")   # retrains model
    return "Training done successfully!"


@app.route("/predict", methods=['POST'])
@cross_origin()
def predictRoute():
    image = request.json['image']
    decodeImage(image, clApp.filename)
    result = clApp.classifier.predict()
    return jsonify(result)


if __name__ == "__main__":
    clApp = ClientApp()
    app.run(host='0.0.0.0', port=8080)  # for AWS / local

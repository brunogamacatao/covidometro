# coding: utf-8
import os
from flask import Flask, jsonify, request
from covidometro import get_dados_atuais


app = Flask(__name__, static_folder="static")

@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/dados')
def dados_covid():
  return jsonify(get_dados_atuais())

if __name__ == "__main__":
  port = int(os.environ.get("PORT", 5000))
  app.run(host='0.0.0.0', port=port)

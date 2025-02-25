# Training Tensorflow Model

## Introduction

[TensorFlow](https://www.tensorflow.org/) is an open-source machine learning software library, TensorFlow is used to train neural networks. Expressed in the form of stateful dataflow graphs, each node in the graph represents the operations performed by neural networks on multi-dimensional arrays. These multi-dimensional arrays are commonly known as “tensors”, hence the name TensorFlow. In this example, we will be training a MNIST model.

## Training TensorFlow models Locally​ <a href="#training-tensorflow-models-locally" id="training-tensorflow-models-locally"></a>

This section is from [TensorFlow 2 quickstart for beginners](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/quickstart/beginner.ipynb)

### TensorFlow 2 quickstart for beginners​ <a href="#tensorflow-2-quickstart-for-beginners" id="tensorflow-2-quickstart-for-beginners"></a>

This short introduction uses [Keras](https://www.tensorflow.org/guide/keras/overview) to:

1. Load a prebuilt dataset.
2. Build a neural network machine learning model that classifies images.
3. Train this neural network.
4. Evaluate the accuracy of the model.

### Set up TensorFlow​ <a href="#set-up-tensorflow" id="set-up-tensorflow"></a>

Import TensorFlow into your program to check whether it is installed

```python
import tensorflow as tf
import os
print("TensorFlow version:", tf.__version__)
```

```bash
mkdir /inputs
wget https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz -O /inputs/mnist.npz
```

```bash
mnist = tf.keras.datasets.mnist

CWD = '' if os.getcwd() == '/' else os.getcwd()
(x_train, y_train), (x_test, y_test) = mnist.load_data('/inputs/mnist.npz')
x_train, x_test = x_train / 255.0, x_test / 255.0
```

### Build a machine-learning model​ <a href="#build-a-machine-learning-model" id="build-a-machine-learning-model"></a>

Build a `tf.keras.Sequential` model by stacking layers.

```python
model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(28, 28)),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10)
])
```

For each example, the model returns a vector of [logits](https://developers.google.com/machine-learning/glossary#logits) or [log-odds](https://developers.google.com/machine-learning/glossary#log-odds) scores, one for each class.

```python
predictions = model(x_train[:1]).numpy()
predictions
```

The `tf.nn.softmax` function converts these logits to _probabilities_ for each class:

```python
tf.nn.softmax(predictions).numpy()
```

Note: It is possible to bake the `tf.nn.softmax` function into the activation function for the last layer of the network. While this can make the model output more directly interpretable, this approach is discouraged as it's impossible to provide an exact and numerically stable loss calculation for all models when using a softmax output.

Define a loss function for training using `losses.SparseCategoricalCrossentropy`, which takes a vector of logits and a `True` index and returns a scalar loss for each example.

```python
loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
```

This loss is equal to the negative log probability of the true class: The loss is zero if the model is sure of the correct class.

This untrained model gives probabilities close to random (1/10 for each class), so the initial loss should be close to `-tf.math.log(1/10) ~= 2.3`.

```python
loss_fn(y_train[:1], predictions).numpy()
```

Before you start training, configure and compile the model using Keras `Model.compile`. Set the [`optimizer`](https://www.tensorflow.org/api_docs/python/tf/keras/optimizers) class to `adam`, set the `loss` to the `loss_fn` function you defined earlier, and specify a metric to be evaluated for the model by setting the `metrics` parameter to `accuracy`.

```python
model.compile(optimizer='adam',
              loss=loss_fn,
              metrics=['accuracy'])
```

### Train and evaluate your model​ <a href="#train-and-evaluate-your-model" id="train-and-evaluate-your-model"></a>

Use the `Model.fit` method to adjust your model parameters and minimize the loss:

```python
model.fit(x_train, y_train, epochs=5)
```

The `Model.evaluate` method checks the models performance, usually on a "[Validation-set](https://developers.google.com/machine-learning/glossary#validation-set)" or "[Test-set](https://developers.google.com/machine-learning/glossary#test-set)".

```python
model.evaluate(x_test,  y_test, verbose=2)
```

The image classifier is now trained to \~98% accuracy on this dataset. To learn more, read the [TensorFlow tutorials](https://www.tensorflow.org/tutorials/).

If you want your model to return a probability, you can wrap the trained model, and attach the softmax to it:

```python
probability_model = tf.keras.Sequential([
  model,
  tf.keras.layers.Softmax()
])
```

```python
probability_model(x_test[:5])
```

```bash
mkdir /outputs
```

The following method can be used to save the model as a checkpoint

```python
model.save_weights('/outputs/checkpoints/my_checkpoint')
```

```bash
ls /outputs/
```

## Running on Bacalhau​ <a href="#running-on-bacalhau" id="running-on-bacalhau"></a>

The dataset and the script are mounted to the TensorFlow container using an URL, we then run the script inside the container

### Declarative job description​ <a href="#declarative-job-description" id="declarative-job-description"></a>

The same job can be presented in the [declarative](broken-reference) format. In this case, the description will look like this:

```yaml
name: Training ML model using tensorflow
type: batch
count: 1
tasks:
  - name: My main task
    Engine:
      type: docker
      params:
        WorkingDirectory: "/inputs"
        Image: "tensorflow/tensorflow" 
        Entrypoint:
          - /bin/bash
        Parameters:
          - -c
          - python train.py
    InputSources:
      - Source:
          Type: urlDownload
          Params:
            URL: https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz
        Target: /inputs
      - Source:
          Type: urlDownload
          Params:
            URL: https://gist.githubusercontent.com/js-ts/e7d32c7d19ffde7811c683d4fcb1a219/raw/ff44ac5b157d231f464f4d43ce0e05bccb4c1d7b/train.py
        Target: /inputs
    Resources:
      GPU: "1"
```

The job description should be saved in `.yaml` format, e.g. `tensorflow.yaml`, and then run with the command:

```bash
bacalhau job run tensorflow.yaml
```

## Checking the State of your Jobs​ <a href="#checking-the-state-of-your-jobs" id="checking-the-state-of-your-jobs"></a>

### Job status​ <a href="#job-status" id="job-status"></a>

You can check the status of the job using `bacalhau job list`.

```bash
bacalhau job list --id-filter ${JOB_ID}
```

When it says `Completed`, that means the job is done, and we can get the results.

### Job information​ <a href="#job-information" id="job-information"></a>

You can find out more information about your job by using `bacalhau job describe`.

```bash
bacalhau job describe ${JOB_ID}
```

### Job download​ <a href="#job-download" id="job-download"></a>

You can download your job results directly by using `bacalhau job get`. Alternatively, you can choose to create a directory to store your results. In the command below, we created a directory and downloaded our job output to be stored in that directory.

```bash
rm -rf results && mkdir -p results
bacalhau job get $JOB_ID --output-dir results
```

After the download has finished you should see the following contents in results directory

## Viewing your Job Output​ <a href="#viewing-your-job-output" id="viewing-your-job-output"></a>

Now you can find the file in the `results/outputs` folder. To view it, run the following command:

```bash
cat results/outputs/
```

## Support​ <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

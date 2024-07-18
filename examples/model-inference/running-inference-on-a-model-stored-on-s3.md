# Running Inference on a Model stored on S3

## Introduction[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#introduction) <a href="#introduction" id="introduction"></a>

In this example, we will demonstrate how to run inference on a model stored on Amazon S3. We will use a PyTorch model trained on the MNIST dataset.

## Running Locally[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#running-locally) <a href="#running-locally" id="running-locally"></a>

### Prerequisites[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#prerequisites) <a href="#prerequisites" id="prerequisites"></a>

Consider using the latest versions or use the docker method listed below in the article.

1. Python
2. PyTorch

### Downloading the Datasets[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#downloading-the-datasets) <a href="#downloading-the-datasets" id="downloading-the-datasets"></a>

Use the following commands to download the model and test image:

```bash
wget https://sagemaker-sample-files.s3.amazonaws.com/datasets/image/MNIST/model/pytorch-training-2020-11-21-22-02-56-203/model.tar.gz
wget https://raw.githubusercontent.com/js-ts/mnist-test/main/digit.png
```

### Creating the Inference Script[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#creating-the-inference-script) <a href="#creating-the-inference-script" id="creating-the-inference-script"></a>

This script is designed to load a pretrained PyTorch model for MNIST digit classification from a `tar.gz` file, extract it, and use the model to perform inference on a given input image. Ensure you have all required dependencies installed:

```bash
pip install Pillow torch torchvision
```

```python
# content of the inference.py file
import torch
import torchvision.transforms as transforms
from PIL import Image
from torch.autograd import Variable
import argparse
import tarfile

class CustomModel(torch.nn.Module):
    def __init__(self):
        super(CustomModel, self).__init__()
        self.conv1 = torch.nn.Conv2d(1, 10, 5)
        self.conv2 = torch.nn.Conv2d(10, 20, 5)
        self.fc1 = torch.nn.Linear(320, 50)
        self.fc2 = torch.nn.Linear(50, 10)

    def forward(self, x):
        x = torch.relu(self.conv1(x))
        x = torch.max_pool2d(x, 2)
        x = torch.relu(self.conv2(x))
        x = torch.max_pool2d(x, 2)
        x = torch.flatten(x, 1)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        output = torch.log_softmax(x, dim=1)
        return output

def extract_tar_gz(file_path, output_dir):
    with tarfile.open(file_path, 'r:gz') as tar:
        tar.extractall(path=output_dir)

# Parse command-line arguments
parser = argparse.ArgumentParser()
parser.add_argument('--tar_gz_file_path', type=str, required=True, help='Path to the tar.gz file')
parser.add_argument('--output_directory', type=str, required=True, help='Output directory to extract the tar.gz file')
parser.add_argument('--image_path', type=str, required=True, help='Path to the input image file')
args = parser.parse_args()

# Extract the tar.gz file
tar_gz_file_path = args.tar_gz_file_path
output_directory = args.output_directory
extract_tar_gz(tar_gz_file_path, output_directory)

# Load the model
model_path = f"{output_directory}/model.pth"
model = CustomModel()
model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
model.eval()

# Transformations for the MNIST dataset
transform = transforms.Compose([
    transforms.Resize((28, 28)),
    transforms.Grayscale(num_output_channels=1),
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,)),
])

# Function to run inference on an image
def run_inference(image, model):
    image_tensor = transform(image).unsqueeze(0)  # Apply transformations and add batch dimension
    input = Variable(image_tensor)

    # Perform inference
    output = model(input)
    _, predicted = torch.max(output.data, 1)
    return predicted.item()

# Example usage
image_path = args.image_path
image = Image.open(image_path)
predicted_class = run_inference(image, model)
print(f"Predicted class: {predicted_class}")

```

### Running the Inference Script[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#running-the-inference-script) <a href="#running-the-inference-script" id="running-the-inference-script"></a>

To use this script, you need to provide the paths to the `tar.gz` file containing the pre-trained model, the output directory where the model will be extracted, and the input image file for which you want to perform inference. The script will output the predicted digit (class) for the given input image.

```bash
python3 inference.py --tar_gz_file_path ./model.tar.gz --output_directory ./model --image_path ./digit.png
```

## Running Inference on Bacalhau[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#running-inference-on-bacalhau) <a href="#running-inference-on-bacalhau" id="running-inference-on-bacalhau"></a>

### Prerequisite[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#prerequisite) <a href="#prerequisite" id="prerequisite"></a>

To get started, you need to install the Bacalhau client, see more information [here](../../getting-started/installation.md)

### Structure of the Command[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#structure-of-the-command) <a href="#structure-of-the-command" id="structure-of-the-command"></a>

1. `export JOB_ID=$( ... )`: Export results of a command execution as environment variable
2. `-w /inputs` Set the current working directory at `/inputs` in the container
3. `-i src=s3://sagemaker-sample-files/datasets/image/MNIST/model/pytorch-training-2020-11-21-22-02-56-203/model.tar.gz,dst=/model/,opt=region=us-east-1`: Mount the s3 bucket at the destination path provided - `/model/` and specifying the region where the bucket is located `opt=region=us-east-1`
4. `-i git://github.com/js-ts/mnist-test.git`: Flag to mount the source code repo from GitHub. It would mount the repo at `/inputs/js-ts/mnist-test` in this case it also contains the test image
5. `pytorch/pytorch`: The name of the Docker image
6. `-- python3 /inputs/js-ts/mnist-test/inference.py --tar_gz_file_path /model/model.tar.gz --output_directory /model-pth --image_path /inputs/js-ts/mnist-test/image.png`: The command to run inference on the model. It consists of:
   1. `/model/model.tar.gz` is the path to the model file
   2. `/model-pth` is the output directory for the model
   3. `/inputs/js-ts/mnist-test/image.png` is the path to the input image

```bash
export JOB_ID=$(bacalhau docker run \
--wait \
--id-only \
--timeout 3600 \
--wait-timeout-secs 3600 \
-w /inputs \
-i src=s3://sagemaker-sample-files/datasets/image/MNIST/model/pytorch-training-2020-11-21-22-02-56-203/model.tar.gz,dst=/model/,opt=region=us-east-1 \
-i git://github.com/js-ts/mnist-test.git \
pytorch/pytorch \
 -- python3 /inputs/js-ts/mnist-test/inference.py --tar_gz_file_path /model/model.tar.gz --output_directory /model-pth --image_path /inputs/js-ts/mnist-test/image.png)
```

When the job is submitted Bacalhau prints out the related job id. We store that in an environment variable `JOB_ID` so that we can reuse it later on.

### Viewing the Output[​](http://localhost:3000/examples/model-inference/S3-Model-Inference/#viewing-the-output) <a href="#viewing-the-output" id="viewing-the-output"></a>

Use the `bacalhau job logs` command to view the job output, since the script prints the result of execution to the stdout:

```bash
bacalhau job logs ${JOB_ID}

Predicted class: 0
```

You can also use `bacalhau job get` to download job results:

```bash
bacalhau job get ${JOB_ID}
```

## Support <a href="#support" id="support"></a>

If you have questions or need support or guidance, please reach out to the [Bacalhau team via Slack](https://bacalhauproject.slack.com/ssb/redirect) (**#general** channel).

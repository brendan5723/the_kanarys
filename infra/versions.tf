terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.80"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.6"
    }
  }

  # Remote state — uncomment after creating the state bucket:
  #   aws s3 mb s3://the-kanarys-tfstate-ACCOUNT_ID --region eu-west-1
  #   aws dynamodb create-table --table-name the-kanarys-tflock \
  #     --attribute-definitions AttributeName=LockID,AttributeType=S \
  #     --key-schema AttributeName=LockID,KeyType=HASH \
  #     --billing-mode PAY_PER_REQUEST --region eu-west-1
  #
  # backend "s3" {
  #   bucket         = "the-kanarys-tfstate-ACCOUNT_ID"
  #   key            = "the-kanarys/terraform.tfstate"
  #   region         = "eu-west-1"
  #   encrypt        = true
  #   dynamodb_table = "the-kanarys-tflock"
  # }
}

provider "aws" {
  region = var.aws_region
}

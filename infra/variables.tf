variable "project" {
  type        = string
  description = "Name prefix for AWS resources."
  default     = "the-kanarys"
}

variable "aws_region" {
  type        = string
  description = "Region for S3, Lambda, API Gateway, DynamoDB, and SES."
  default     = "eu-west-1"
}

variable "ses_from" {
  type        = string
  description = "Verified SES from-address. Leave empty to skip email and store in DynamoDB only."
  default     = ""
}

variable "ses_to" {
  type        = string
  description = "Inbox that receives contact form mail. In SES sandbox this must also be verified."
  default     = ""
}

variable "github_repository" {
  type        = string
  description = "GitHub repo in owner/name form for OIDC deploy. Leave empty to skip the deploy role."
  default     = ""
}

variable "create_github_oidc_provider" {
  type        = bool
  description = "Set true on the first apply if this account does not already have the GitHub OIDC provider."
  default     = false
}

variable "cors_origin" {
  type        = string
  description = "Allowed browser origin for the contact API. * is fine behind same-origin CloudFront."
  default     = "*"
}

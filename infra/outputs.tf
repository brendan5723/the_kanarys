output "cloudfront_url" {
  description = "HTTPS URL for the site (CloudFront default domain)."
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "site_bucket" {
  value = aws_s3_bucket.site.bucket
}

output "contact_api_url" {
  description = "Direct API Gateway URL (CloudFront /contact is the public path)."
  value       = "${aws_apigatewayv2_api.contact.api_endpoint}/contact"
}

output "contacts_table" {
  value = aws_dynamodb_table.contacts.name
}

output "github_deploy_role_arn" {
  value = try(aws_iam_role.github[0].arn, null)
}

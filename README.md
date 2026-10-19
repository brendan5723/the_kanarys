# The Kanarys

Static band site for a blues-rock trio from Armagh City — Brendan, Conor, and Cormac — hosted as a small AWS sandbox.

```
visitor → CloudFront → S3 (site)
                    → API Gateway → Lambda → SES (optional) + DynamoDB
```

No VPC, no RDS, no login. Typical cost at this scale is **cents per month**. Destroy the stack when you are not using it.

## Local

Needs Node 20+.

```bash
npm install
npm install --prefix web
npm install --prefix lambda/contact
npm run dev
```

- Site: http://127.0.0.1:5173
- Contact stub: `POST http://127.0.0.1:3001/contact` (Vite proxies `/contact`)

The local Lambda logs the message and returns `{ "ok": true }` without AWS. Put YouTube / Spotify / Bandcamp embed URLs in [`web/src/content.ts`](web/src/content.ts).

```bash
npm test
npm run build --prefix web
```

## AWS (sandbox)

Region default: `eu-west-1`. Uses your existing `~/.aws` credentials.

1. Install the Lambda deps so Terraform can zip them:

   ```bash
   npm install --omit=dev --prefix lambda/contact
   npm run build --prefix web
   ```

2. Copy [`infra/terraform.tfvars.example`](infra/terraform.tfvars.example) to `infra/terraform.tfvars`. SES addresses are optional. If you skip them, messages still land in DynamoDB (handy while SES is in sandbox).

3. Apply:

   ```bash
   cd infra
   terraform init
   terraform apply
   ```

4. Upload the site and invalidate CloudFront:

   ```bash
   BUCKET=$(terraform output -raw site_bucket)
   DIST=$(terraform output -raw cloudfront_distribution_id)
   aws s3 sync ../web/dist "s3://$BUCKET" --delete
   aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/*"
   terraform output cloudfront_url
   ```

The public contact path is **same-origin** `POST /contact` on the CloudFront URL. DynamoDB table name is in `terraform output contacts_table`.

### SES

In the SES sandbox you can only send from and to verified identities. Set `ses_from` / `ses_to` and confirm the email AWS sends you. If SES fails after a DynamoDB write, the form still succeeds.

### GitHub Actions

Set repo secret `AWS_DEPLOY_ROLE_ARN` to the `github_deploy_role_arn` output after you set `github_repository` (for example `your-user/the-kanarys`) and re-apply. The workflow on `main` builds the site, runs `terraform apply`, syncs `web/dist`, and invalidates CloudFront.

If the account does not already have `token.actions.githubusercontent.com` as an OIDC provider, set `create_github_oidc_provider = true` on the first apply.

## Tear down

```bash
cd infra
aws s3 rm "s3://$(terraform output -raw site_bucket)" --recursive
terraform destroy
```

`force_destroy` is on the bucket so destroy works after objects are gone. CloudFront can take several minutes to delete.

## Layout

```
web/                 Vite + React + TypeScript
lambda/contact/      Node 20 handler
infra/               Terraform
.github/workflows/   OIDC deploy
```

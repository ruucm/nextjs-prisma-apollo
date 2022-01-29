-- CreateEnum
CREATE TYPE "pricing_plan_interval" AS ENUM ('day', 'week', 'month', 'year');

-- CreateEnum
CREATE TYPE "pricing_type" AS ENUM ('one_time', 'recurring');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "email_verified" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "compound_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider_type" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "access_token_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "session_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "usersId" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "active" BOOLEAN,
    "description" TEXT,
    "unit_amount" BIGINT,
    "currency" TEXT,
    "type" "pricing_type",
    "interval" "pricing_plan_interval",
    "interval_count" INTEGER,
    "trial_period_days" INTEGER,
    "metadata" JSONB,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT,
    "metadata" JSONB,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "subscription_status",
    "metadata" JSONB,
    "price_id" TEXT,
    "quantity" INTEGER,
    "cancel_at_period_end" BOOLEAN,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "current_period_start" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "current_period_end" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "ended_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "cancel_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "canceled_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "trial_start" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "trial_end" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_compound_id_key" ON "account"("compound_id");

-- CreateIndex
CREATE INDEX "providerAccountId" ON "account"("provider_account_id");

-- CreateIndex
CREATE INDEX "providerId" ON "account"("provider_id");

-- CreateIndex
CREATE INDEX "userId" ON "account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "session_access_token_key" ON "session"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_requests_token_key" ON "verification_requests"("token");

-- CreateIndex
CREATE UNIQUE INDEX "customers_stripe_customer_id_key" ON "customers"("stripe_customer_id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

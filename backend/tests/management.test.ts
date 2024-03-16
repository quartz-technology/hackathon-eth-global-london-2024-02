import { test, expect, describe } from "bun:test";
import supertest from "supertest";

import { v4 as uuidv4 } from "uuid";

import { createApp } from "@server";

import type { User as CircleUser } from "@service/circle/types";

const app = createApp();

test("GET /healthcheck", async () => {
  await supertest(app).get("/healthcheck").expect(200).expect({ status: "ok" });
});

describe("Register to the platform flow", async () => {
  const name = `register-test-${uuidv4()}`;
  let user: CircleUser;

  test("POST /user/register", async () => {
    const res = await supertest(app).post("/user/register").send({
      name,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");

    user = res.body.user;

    expect(user).toHaveProperty("userID");
    expect(user).toHaveProperty("userToken");
    expect(user).toHaveProperty("encryptionKey");
    expect(user).toHaveProperty("challengeID");
    expect(user).toHaveProperty("name", name);
  });

  test("POST /user/connect", async () => {
    const res = await supertest(app).post("/user/connect").send({
      name,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");

    const session = res.body.user;
    expect(session).toHaveProperty("userID", user.userID);
    expect(session).toHaveProperty("userToken");
    expect(session).toHaveProperty("encryptionKey");
  });

  test("GET /user/:userID", async () => {
    const res = await supertest(app).get(`/user/${user.userID}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");

    const loggedUser = res.body.user;
    expect(loggedUser).toHaveProperty("status", "ENABLED");
    expect(loggedUser).toHaveProperty("pinStatus", "UNSET");
    expect(loggedUser).toHaveProperty("id");
    expect(loggedUser).toHaveProperty("createDate");
    expect(loggedUser).toHaveProperty("pinDetails");
    expect(loggedUser).toHaveProperty("securityQuestionStatus", "UNSET");
    expect(loggedUser).toHaveProperty("authMode", "PIN");
  });

  test("GET /user/:userID/organisation", async () => {
    const res = await supertest(app).get(`/user/${user.userID}/organisation`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("organisations");
    expect(res.body).toHaveProperty("groups");

    const organisations = res.body.organisations;
    expect(organisations.length).toBe(0);

    const groups = res.body.groups;
    expect(groups.length).toBe(0);
  })
});

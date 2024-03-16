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

  test("Create a new account - POST /user/register", async () => {
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

  test("Connect using the existing account - POST /user/connect", async () => {
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

  test("Get the user - GET /user/:userID", async () => {
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

  test("Get the user organisations - GET /user/:userID/organisation", async () => {
    const res = await supertest(app).get(`/user/${user.userID}/organisation`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("organisations");
    expect(res.body).toHaveProperty("groups");

    const organisations = res.body.organisations;
    expect(organisations.length).toBe(0);

    const groups = res.body.groups;
    expect(groups.length).toBe(0);
  });
});

describe("Manage organisation flow", async () => {
  const masterName = `org-test-master-${uuidv4()}`;
  const memberNames = [`org-test-member-${uuidv4()}`, `org-test-member-${uuidv4()}`];
  const organisationName = `org-test-${uuidv4()}`;
  const users: { [name: string]: CircleUser } = {};
  let organisationID: string;

  test("Register users to the platform", async () => {
    for (const name of [masterName, ...memberNames]) {
      const res = await supertest(app).post("/user/register").send({
        name,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("user");

      users[name] = res.body.user;
    }
  });

  test("Master creates an organisation - POST /organisation", async () => {
    const res = await supertest(app).post("/organisation").send({
      name: organisationName,
      userID: users[masterName].userID,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("organisation");

    const organisation = res.body.organisation;
    expect(organisation).toHaveProperty("id");
    expect(organisation).toHaveProperty("name", organisationName);
    organisationID = organisation.id;
  });

  test("Check the master is in the organisation - GET /organisation/:organisationID", async () => {
    const res = await supertest(app).get(`/organisation/${organisationID}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("organisation");

    const organisation = res.body.organisation;
    expect(organisation).toHaveProperty("id", organisationID);
    expect(organisation).toHaveProperty("name", organisationName);
    expect(organisation).toHaveProperty("users");
    expect(organisation).toHaveProperty("groups");

    const orgUsers = organisation.users;
    expect(orgUsers.length).toBe(1);
    expect(orgUsers[0]).toHaveProperty("id", users[masterName].userID);
    expect(orgUsers[0]).toHaveProperty("name", masterName);

    const groups = res.body.organisation.groups;
    expect(groups.length).toBe(0);
  });

  test("Add members to the organisation - POST /organisation/add", async () => {
    for (const name of memberNames) {
      const res = await supertest(app).post(`/organisation/${organisationID}/add`).send({
        userID: users[name].userID,
      });

      expect(res.status).toBe(200);
    }

    const res = await supertest(app).get(`/organisation/${organisationID}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("organisation");

    const organisation = res.body.organisation;
    expect(organisation).toHaveProperty("users");

    const orgUsers = organisation.users;
    expect(orgUsers.length).toBe(3);
  })
});

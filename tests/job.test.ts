import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import { beforeAll, afterAll, describe, it, expect } from "vitest";

import { jobRoutes } from "../src/interfaces/http/routes/jobRoutes";
import { JobController } from "../src/interfaces/http/controllers/JobController";
import { CreateJobUseCase } from "../src/application/job/CreateJobUseCase";
import { UpdateJobUseCase } from "../src/application/job/UpdateJobUseCase";
import { GetJobByIdUseCase } from "../src/application/job/GetJobByIdUseCase";
import { GetJobsPaginatedUseCase } from "../src/application/job/GetJobsPaginatedUseCase";
import { DeleteJobUseCase } from "../src/application/job/DeleteJobUseCase";
import { MongoJobRepository } from "../src/infrastructure/job/MongoJobRepository";
import { errorHandler } from "../src/interfaces/http/middlewares/errorHandler";

import { setupDB } from "./setup";
import { teardownDB } from "./teardown";
import createJobReq from "./reqs/createJob.json";
import updateJobReq from "./reqs/updateJob.json";
import { error } from "console";

let app: express.Application;
let jobId: string;

beforeAll(async () => {
  await setupDB();

  const repo = new MongoJobRepository();
  const controller = new JobController(
    new CreateJobUseCase(repo),
    new UpdateJobUseCase(repo),
    new GetJobByIdUseCase(repo),
    new GetJobsPaginatedUseCase(repo),
    new DeleteJobUseCase(repo)
  );

  app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/jobs", jobRoutes(controller));
  app.use(errorHandler);
});

afterAll(async () => {
  await teardownDB();
});

describe("Job API", () => {
  // POST /jobs
  it("creates a job when role=admin", async () => {
    const res = await request(app)
      .post("/jobs")
      .set("Cookie", ["role=admin"])
      .send(createJobReq);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Job created");
  });

  it("rejects job creation without admin role", async () => {
    const res = await request(app).post("/jobs").send(createJobReq);
    expect(res.status).toBe(403);
  });

  it("rejects invalid job payload", async () => {
    const res = await request(app)
      .post("/jobs")
      .set("Cookie", ["role=admin"])
      .send({ title: "Only title" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid request data");
  });

  // GET /jobs
  it("lists jobs with pagination metadata", async () => {
    const res = await request(app).get("/jobs");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.jobs)).toBe(true);
    expect(res.body).toHaveProperty("lastCursor");
    expect(res.body).toHaveProperty("loadMore");

    // Capture jobId for later tests
    expect(res.body.jobs.length).toBeGreaterThan(0);
    jobId = res.body.jobs[0].jobId;
  });

  // GET /jobs/:id
  it("gets job details by id", async () => {
    const res = await request(app).get(`/jobs/${jobId}`);
    expect(res.status).toBe(200);
    expect(res.body.jobId).toBe(jobId);
  });

  it("returns 404 for non-existent job id", async () => {
    const res = await request(app).get(
      "/jobs/00000000-0000-0000-0000-000000000000"
    );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Job not found");
  });

  // PUT /jobs/:id
  it("updates job when role=admin", async () => {
    const res = await request(app)
      .put(`/jobs/${jobId}`)
      .set("Cookie", ["role=admin"])
      .send(updateJobReq);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Job updated");
  });

  it("rejects update without admin role", async () => {
    const res = await request(app).put(`/jobs/${jobId}`).send(updateJobReq);

    expect(res.status).toBe(403);
  });

  it("rejects invalid update payload", async () => {
    const res = await request(app)
      .put(`/jobs/${jobId}`)
      .set("Cookie", ["role=admin"])
      .send({ title: "Only title" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid request data");
  });

  it("returns 404 when updating non-existent job", async () => {
    const res = await request(app)
      .put("/jobs/00000000-0000-0000-0000-000000000000")
      .set("Cookie", ["role=admin"])
      .send(updateJobReq);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Job not found");
  });

  // DELETE /jobs/:id
  it("deletes job when role=admin", async () => {
    const res = await request(app)
      .delete(`/jobs/${jobId}`)
      .set("Cookie", ["role=admin"]);

    expect(res.status).toBe(204);
  });

  it("rejects deletion without admin role", async () => {
    const res = await request(app).delete(`/jobs/${jobId}`);
    expect(res.status).toBe(403);
  });

  it("returns 404 when deleting non-existent job", async () => {
    const res = await request(app)
      .delete("/jobs/00000000-0000-0000-0000-000000000000")
      .set("Cookie", ["role=admin"]);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Job not found");
  });
});

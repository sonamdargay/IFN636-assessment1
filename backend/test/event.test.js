const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const chaiHttp = require("chai-http");

const app = require("../server");
const Event = require("../models/Event");
const { addEvent } = require("../controllers/eventController");
const { getEvents } = require("../controllers/eventController");

const { expect } = chai;
chai.use(chaiHttp);

describe("EventController - addEvent", () => {
  it("should successfully create a new event", async () => {
    const req = {
      body: {
        eventName: "Test Event",
        description: "A test description",
        date: "2025-12-31",
        location: "Thimphu",
      },
    };

    const createdEvent = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      createdAt: new Date(),
    };

    const createStub = sinon.stub(Event, "create").resolves(createdEvent);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await addEvent(req, res);

    expect(createStub.calledOnceWith(req.body)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdEvent)).to.be.true;

    createStub.restore();
  });

  it("should return 500 if an error occurs", async () => {
    const req = {
      body: {
        eventName: "Test Event",
        description: "A test description",
        date: "2025-12-31",
        location: "Thimphu",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    const createStub = sinon
      .stub(Event, "create")
      .throws(new Error("DB Error"));

    await addEvent(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;

    createStub.restore();
  });
});

describe("getEvents Function Test", () => {
  afterEach(() => {
    sinon.restore(); // Clean up after each test
  });

  it("should return a list of events", async () => {
    const mockEvents = [
      {
        _id: new mongoose.Types.ObjectId(),
        eventName: "Tech Conference",
        description: "Technology event",
        date: "2025-06-15",
        location: "Sydney",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        eventName: "Hackathon",
        description: "Coding competition",
        date: "2025-07-01",
        location: "Brisbane",
      },
    ];

    const findStub = sinon.stub(Event, "find").resolves(mockEvents);

    const req = {}; // No user-specific logic in getEvents
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getEvents(req, res);

    expect(findStub.calledOnce).to.be.true;
    expect(res.json.calledWith(mockEvents)).to.be.true;
    expect(res.status.called).to.be.false; // Should not return error status
  });

  it("should return 500 on database error", async () => {
    const findStub = sinon.stub(Event, "find").throws(new Error("DB error"));

    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getEvents(req, res);

    expect(findStub.calledOnce).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: "DB error" })).to.be.true;
  });
});

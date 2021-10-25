let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

chai.should();
chai.use(chaiHttp);
const request = chai.request;

// Test the GET (by id)
describe("GET /user/:id", () => {
    it("It should GET the balance by passing VALID user", async () => {
        const id = "user-1";
        const url = `/user/${id}`;
        const res = await request(server).get(url);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('total');     
    });

    it("It should NOT GET the balance by passing INVALID user", async () => {
        const id = "user-4";
        const url = `/user/${id}`;
        const res = await request(server).get(url);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error'); 
    });
});

// Test with other URL
describe("Invalid url", () => {
    const random_url = "/test";
    it("It should return 404", async () => {
        const res = await request(server).get(random_url);
        res.should.have.status(404);
    });
});
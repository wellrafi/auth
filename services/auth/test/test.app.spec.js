const request = require("supertest");
const app = require("../app");

describe("test rest api authentication", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/v1/signup")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });  
});

describe("test rest api post auth", () => {

  test("It should response the GET method", done => {

    let signUp = {
      username: "javaskadafo",
      password: "javaskadafi"
    }

    request(app)
      .post("/v1/signup")
      .send(signUp)
      .then(response => {
        expect(response.statusCode).toBe(201);
        done();
      });
  });
  
})
require("es6-promise").polyfill();
require("isomorphic-fetch");

const url = (path) => `http://localhost:3000${path}`;
let cookie;

describe("Validate functionality", () => {
  it("register a user", (done) => {
    fetch(url("/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "test3",
        password: "test",
        headline: "test",
        email: "test@gmail",
        zipcode: "12345",
        dob: "2000-01-01",
      }),
    })
      .then((res) => {
        expect(res.status).toEqual(200);
        return res.text();
      })
      .then((body) => {
        expect(body).toEqual('{"result":"success","username":"test3"}');
        done();
      });
  });

  it("login a user", (done) => {
    fetch(url("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test3", password: "test" }),
    })
      .then((res) => {
        cookie = res.headers.get("Set-Cookie");
        expect(res.status).toEqual(200);
        return res.text();
      })
      .then((body) => {
        expect(body).toEqual('{"username":"test3","result":"success"}');
        done();
      });
  });

  it("update headline", (done) => {
    fetch(url("/headline"), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ headline: "test" }),
    })
      .then((res) => {
        expect(res.status).toEqual(200);
        return res.text();
      })
      .then((body) => {
        expect(body).toEqual('{"username":"test3","headline":"test"}');
        done();
      });
  });

  it("get headline", (done) => {
    fetch(url("/headline"), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => {
        expect(res.status).toEqual(200);
        return res.text();
      })
      .then((body) => {
        expect(body).toEqual('{"username":"test3","headline":"test"}');
        done();
      });
  });

  it("add article", (done) => {
    fetch(url("/article"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ text: "test" }),
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.articles.text).toEqual("test");
        done();
      });
  });

  it("get articles", (done) => {
    fetch(url("/articles"), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.articles.length).toBeGreaterThan(0);
        done();
      });
  });

  it("get article by id", (done) => {
    fetch(url("/articles/60"), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.articles.text).toEqual("test");
        done();
      });
  });

  it("get article by author", (done) => {
    fetch(url("/articles?author=test3"), {
      method: "GET",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    })
      .then((res) => res.json())
      .then((res) => {
        expect(res.articles[0].author).toEqual("test3");
        done();
      });
  });

  it("logout", (done) => {
    fetch(url("/logout"), {
      method: "PUT",
      headers: { Cookie: cookie },
    })
      .then((res) => {
        expect(res.status).toEqual(200);
        return res.text();
      })
      .then((body) => {
        expect(body).toEqual("OK");
        done();
      });
  });
});

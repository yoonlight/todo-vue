import axios from "axios";

const instance = axios.create({
  baseURL: "/api/",
  headers: {
    "X-Custom-Header": "foobar"
    // 'Authorization': sessionStorage.getItem("token"),
    // 'Content-Type': 'multipart/form-data'
  }
});

const auth = {
  post: async body => {
    const res = await instance.post("authenticate", body);
    sessionStorage.setItem("token", `Bearer ${res.data.token}`);
    return res;
  },
  logout: () => instance.get("auth/logout")
};
const endpoint = {
  todo: "todo",
  project: "project",
  subject: "subject"
};

const todo = {
  list: (subject, offset, limit, query) =>
    instance.get(
      endpoint.todo + `/${subject}?offset=${offset}&limit=${limit}` + query
    ),
  theme: () => instance.get(endpoint.todo + "/theme"),
  get: id => instance.get(endpoint.todo + `/${id}`),
  post: body => instance.post(endpoint.todo + ``, body),
  update: body => instance.put(endpoint.todo + `/${body._id}`, body),
  delete: id => instance.delete(endpoint.todo + `/${id}`)
};

const project = {
  list: () => instance.get(endpoint.project),
  get: id => instance.get(endpoint.project + `/${id}`),
  post: body => instance.post(endpoint.project + body),
  update: body => instance.put(endpoint.project + `/${body.id}`, body),
  delete: id => instance.delete(endpoint.project + `/${id}`)
};
const subject = {
  list: () => instance.get(endpoint.subject),
  get: id => instance.get(endpoint.subject + `/${id}`),
  post: body => instance.post(endpoint.subject + body),
  update: body => instance.put(endpoint.subject + `/${body.id}`, body),
  delete: id => instance.delete(endpoint.subject + `/${id}`)
};
const api = {
  auth,
  todo,
  project,
  subject
};

export default {
  ...api
};

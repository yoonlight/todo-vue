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
  }
};

const todo = {
  list: (theme, offset, limit, query) =>
    instance.get(`todo?theme=${theme}&offset=${offset}&limit=${limit}` + query),
  theme: () => instance.get("todo/theme"),
  get: id => instance.get(`todo/${id}`),
  post: body => instance.post(`todo`, body),
  update: body => instance.put(`todo/${body._id}`, body),
  delete: id => instance.delete(`todo/${id}`)
};

const api = {
  auth,
  todo
};

export default {
  ...api
};

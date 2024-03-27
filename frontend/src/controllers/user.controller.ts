const url = `https://moments-server-6qo6tf2l7q-uc.a.run.app/api/users`;
import axios from "axios";

export class UserController {
  // TODO: Change how errors are handled in frontend, currently just logs error

  static async get_all() {
    const response = await axios({
      method: "get",
      url: `${url}/`,
    });

    console.log(response.data);
    return response.data;
  }

  static async get_user_profile(user_id: String) {
    const response = await axios({
      method: "get",
      url: `${url}/${user_id}`,
    });

    console.log(response.data);
    return response.data;
  }

  static async create_user(user: any) {
    const response = await axios({
      method: "post",
      url: `${url}/`,
      data: user,
    });

    console.log(response.data);
    return response.data;
  }

  static async update_user(user_id: String, user: any) {
    const response = await axios({
      method: "put",
      url: `${url}/${user_id}`,
      data: user,
    });

    console.log(response.data);
    return response.data;
  }

  static async delete_user(user_id: String) {
    const response = await axios({
      method: "delete",
      url: `${url}/${user_id}`,
    });

    console.log(response);
    return response;
  }
}

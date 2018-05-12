package de.b4.justmusic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.b4.justmusic.entity.AbstractCollection;
import de.b4.justmusic.entity.User;
import de.b4.justmusic.service.LibraryService;
import de.b4.justmusic.service.UserService;
import io.javalin.Handler;
import io.javalin.Javalin;

import static io.javalin.ApiBuilder.*;

public class UserController extends AbstractController {

  public static void addRoutes(Javalin app) {
    app.routes(() -> {
      path("api", () -> {
        //before("*", SecurityService.checkToken);
        path("user", () -> {
          get("", UserController.getAll);
          post("", UserController.createUser);
          put("", UserController.updateUser);
          get(":id", UserController.getById);
          delete("", UserController.deleteUser);
        });
      });
    });
  }

  public static Handler getAll = ctx -> {
    // todo: only possible if admin or user himself
    AbstractCollection.Paging paging = createPagingObject(ctx.queryParamMap());
    if (paging.getSort() == null) {
      paging.setSort("username");
    }
    ctx.json(UserService.getUserService().getUsers());
  };

  public static Handler getById = ctx -> {
    User user = UserService.getUserService().getUser(ctx.param("id"));
    if (user != null) {
      ctx.json(user);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler createUser = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    User user = mapper.readValue(ctx.body(), User.class);
    if (UserService.getUserService().createUser(user) == true) {
      ctx.status(201);
      ctx.json(user);
    }
    else {
      ctx.status(400);
    }
  };

  public static Handler updateUser = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    User user = mapper.readValue(ctx.body(), User.class);
    if (UserService.getUserService().updateUser(user) == true) {
      ctx.status(200);
      ctx.json(user);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler deleteUser = ctx -> {
    ObjectMapper mapper = new ObjectMapper();
    User user = mapper.readValue(ctx.body(), User.class);
    ctx.status(UserService.getUserService().deleteUser(user) ? 200 : 404);
  };
}

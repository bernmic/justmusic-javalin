package de.b4.justmusic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.b4.justmusic.entity.AbstractCollection;
import de.b4.justmusic.entity.User;
import de.b4.justmusic.security.SecurityService;
import de.b4.justmusic.service.UserService;
import io.javalin.Handler;
import io.javalin.Javalin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static io.javalin.ApiBuilder.*;

public class UserController extends AbstractController {
  private static Logger log = LoggerFactory.getLogger(UserController.class);
  private final static String PARAM_USERNAME = "username";
  private final static String PARAM_THEME = "theme";

  public static void addRoutes(Javalin app) {
    app.routes(() -> {
      path("api", () -> {
        before("*", SecurityService.checkToken);
        path("user", () -> {
          get("", UserController.getAll);
          post("", UserController.createUser);
          put("", UserController.updateUser);
          get(":username", UserController.getById);
          delete("", UserController.deleteUser);
          post(":username/theme/:theme", UserController.setTheme);
        });
      });
    });
  }

  public static Handler getAll = ctx -> {
    User loggedInUser = ctx.attribute("user");
    if (!loggedInUser.isAdmin()) {
      ctx.status(401);
      return;
    }
    AbstractCollection.Paging paging = createPagingObject(ctx.queryParamMap());
    if (paging.getSort() == null) {
      paging.setSort("username");
    }
    ctx.json(UserService.getUserService().getUsers());
  };

  public static Handler getById = ctx -> {
    User loggedInUser = ctx.attribute("user");
    User user = UserService.getUserService().getUser(ctx.param("username"));
    if (user != null && user.getUsername().equals(loggedInUser.getUsername()) || loggedInUser.isAdmin()) {
      user.setPassword(null);
      ctx.json(user);
    }
    else {
      ctx.status(401);
    }
  };

  public static Handler createUser = ctx -> {
    User loggedInUser = ctx.attribute("user");
    if (!loggedInUser.isAdmin()) {
      ctx.status(401);
      return;
    }
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
    User loggedInUser = ctx.attribute("user");
    if (!loggedInUser.isAdmin()) {
      ctx.status(401);
      return;
    }
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
    User loggedInUser = ctx.attribute("user");
    if (!loggedInUser.isAdmin()) {
      ctx.status(401);
      return;
    }
    ObjectMapper mapper = new ObjectMapper();
    User user = mapper.readValue(ctx.body(), User.class);
    ctx.status(UserService.getUserService().deleteUser(user) ? 200 : 404);
  };

  public static Handler setTheme = ctx -> {
    User loggedInUser = ctx.attribute("user");
    User user = UserService.getUserService().getUser(ctx.param("username"));
    if (user != null && user.getUsername().equals(loggedInUser.getUsername()) || loggedInUser.isAdmin()) {
      UserService.getUserService().setTheme(user, ctx.param("theme"));
      user.setPassword(null);
      ctx.json(user);
    }
    else {
      ctx.status(401);
    }
  };
}

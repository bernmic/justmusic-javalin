package de.b4.justmusic.controller;

import de.b4.justmusic.service.ServiceRegistry;
import io.javalin.Handler;
import io.javalin.Javalin;

import static io.javalin.ApiBuilder.get;
import static io.javalin.ApiBuilder.path;

public class SearchController extends AbstractController {

  public static void addRoutes(Javalin app) {
    app.routes(() -> {
      path("api", () -> {
        //before("*", SecurityService.checkToken);
        path("search", () -> {
          get("", SearchController.search);
        });
      });
    });
  }

  public static Handler search = ctx -> {
    ctx.json(ServiceRegistry.getLibraryService().search(ctx.queryParam("q")));
  };
}

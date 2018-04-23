package de.b4.justmusic.controller;

import de.b4.justmusic.security.SecurityService;
import io.javalin.Handler;
import io.javalin.Javalin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoginController {
  private static Logger log = LoggerFactory.getLogger(LoginController.class);

  public static void addRoutes(Javalin app) {
    app.get("/token", LoginController.login);
  }

  public static Handler login = SecurityService.login;
}

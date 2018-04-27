package de.b4.justmusic;

import de.b4.justmusic.controller.*;
import de.b4.justmusic.service.LibraryService;
import de.b4.justmusic.service.PlaylistService;
import io.javalin.Javalin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public class Application {
  private static Logger log = LoggerFactory.getLogger(Application.class);

  public static void main(String args[]) {
    Javalin app = Javalin
            .create()
            .defaultContentType("application/json")
            .enableStaticFiles("/static")
            .enableCorsForOrigin("*")
            .port(7000)
            .start();

    LoginController.addRoutes(app);
    SongController.addRoutes(app);
    AlbumController.addRoutes(app);
    ArtistController.addRoutes(app);
    PlaylistController.addRoutes(app);

    app.error(404, ctx -> {
      if (!ctx.uri().startsWith("/api/")) {
        ctx.redirect("/");
      }
      else {
        Map<String, Object> result = new HashMap<>();
        result.put("status", 404);
        result.put("message", "Not found");
        ctx.json(result);
      }
    });
    app.error(401, ctx -> {
      Map<String, Object> result = new HashMap<>();
      result.put("status", 401);
      result.put("message", "Access denied");
      ctx.json(result);
    });

    LibraryService libraryService = LibraryService.getLibraryService();
    libraryService.loadLibrary();
    PlaylistService.getPlaylistService().loadPlaylists();
    CompletableFuture.supplyAsync(() -> libraryService.scanMedia());
    //LibraryService.getLibraryService().scanMedia();
  }
}

package de.b4.justmusic.controller;

import de.b4.justmusic.entity.AbstractCollection;
import de.b4.justmusic.entity.AbstractPlaylist;
import de.b4.justmusic.entity.SongCollection;
import de.b4.justmusic.service.ConfigService;
import de.b4.justmusic.service.ServiceRegistry;
import io.javalin.Handler;
import io.javalin.Javalin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

import static io.javalin.apibuilder.ApiBuilder.get;
import static io.javalin.apibuilder.ApiBuilder.post;
import static io.javalin.apibuilder.ApiBuilder.put;
import static io.javalin.apibuilder.ApiBuilder.delete;
import static io.javalin.apibuilder.ApiBuilder.path;

public class PlaylistController {
  private final static Logger log = LoggerFactory.getLogger(PlaylistController.class);

  public static void addRoutes(Javalin app) {
    app.routes(() -> {
      path("api", () -> {
        //before("*", SecurityService.checkToken);
        path("playlist", () -> {
          get("", PlaylistController.getAll);
          get(":id", PlaylistController.getById);
          get(":id/songs", PlaylistController.getSongs);
          post(":id/songs", PlaylistController.addSongsToPlaylist);
          put(":id/songs", PlaylistController.setSongsOfPlaylist);
          delete(":id/songs", PlaylistController.removeSongsFromPlaylist);
        });
      });
    });
  }

  public static Handler getAll = ctx -> {
    ctx.json(ServiceRegistry.getPlaylistService().getPlaylists());
  };

  public static Handler getById = ctx -> {
    AbstractPlaylist playlist = ServiceRegistry.getPlaylistService().getPlaylistById(ctx.pathParam("id"));
    if (playlist != null) {
      ctx.json(playlist);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler getSongs = ctx -> {
    String id = ctx.pathParam("id");
    AbstractPlaylist playlist = ServiceRegistry.getPlaylistService().getPlaylistById(id);
    if (playlist != null) {
      SongCollection songCollection = new SongCollection();
      songCollection.setSongs(playlist.getSongs());
      songCollection.setPaging(new AbstractCollection.Paging());
      songCollection.getPaging().setSize(songCollection.getSongs().size());
      ctx.json(songCollection);
    }
    else {
      ctx.status(404);
    }
  };

  public static Handler addSongsToPlaylist = ctx -> {
    log.info("addSongsToPlaylist not implemented yet");
    String id = ctx.pathParam("id");
    Map<String,Integer> result = new HashMap<>();
    result.put("added", 0);
    ctx.json(result);
  };


  public static Handler removeSongsFromPlaylist = ctx -> {
    log.info("removeSongsFromPlaylist not implemented yet");
    String id = ctx.pathParam("id");
    Map<String,Integer> result = new HashMap<>();
    result.put("removed", 0);
    ctx.json(result);
  };


  public static Handler setSongsOfPlaylist = ctx -> {
    log.info("setSongsOfPlaylist not implemented yet");
    String id = ctx.pathParam("id");
    Map<String,Integer> result = new HashMap<>();
    result.put("added", 0);
    result.put("removed", 0);
    ctx.json(result);
  };
}

package de.b4.justmusic.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.b4.justmusic.service.ConfigService;
import de.b4.justmusic.service.LibraryService;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DynamicPlaylist extends AbstractPlaylist {
  private final static Logger log = LoggerFactory.getLogger(DynamicPlaylist.class);

  private final static ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

  private final static Map<String,List<Song>> songLists = new HashMap<>();

  private String script = "var getSongs = function() {\n" +
          "    return songService.findAllSongs();\n" +
          "};";


  @Override
  @JsonIgnore
  public List<Song> getSongs() {
    if (songLists.containsKey(this.getPlaylistId())) {
      return songLists.get(this.getPlaylistId());
    }
    try {
      engine.put("libraryService", LibraryService.getLibraryService());
      engine.eval(getScript());
      Invocable invocable = (Invocable) engine;
      List<Song> songs = (List<Song>)invocable.invokeFunction("getSongs");
      songLists.put(this.getPlaylistId(), songs);
      return songs;
    } catch (Exception e) {
      log.error("Error executing " + getFilename(), e);
    }
    throw new IllegalArgumentException("Error in script");
  }

  @Override
  public void setName(String name) {
    super.setName(name);
    super.setFilename(ConfigService.getConfig().getPlaylistPath() + File.separator + name + ".js");
  }

  @Override
  public void setFilename(String filename) {
    super.setFilename(filename);
    super.setName(FilenameUtils.getBaseName(filename));
  }

  public String getScript() {
    return script;
  }

  public void setScript(String script) {
    this.script = script;
  }
}

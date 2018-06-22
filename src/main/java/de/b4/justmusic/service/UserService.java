package de.b4.justmusic.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.b4.justmusic.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

public class UserService {
  private final static Logger log = LoggerFactory.getLogger(UserService.class);

  UserService() {}

  public void loadUsers() {
    File file = new File(ConfigService.getConfig().getUsersFile());
    if (file.exists()) {
      ObjectMapper mapper = new ObjectMapper();
      try {
        List<User> users = Arrays.asList(mapper.readValue(file, User[].class));
        CacheService.getUserMap().clear();
        if (users != null) {
          users.forEach(user -> {
            CacheService.getUserMap().put(user.getUsername(), user);
          });
        }
        log.info(String.format("Loaded %d user from user file.", CacheService.getUserMap().size()));
      } catch (IOException e) {
        log.error("Could not load users from " + ConfigService.getConfig().getUsersFile(), e);
      }
    }
  }

  private void saveUsers() {
    log.info("Save users to " + ConfigService.getConfig().getUsersFile());

    File file = new File(ConfigService.getConfig().getUsersFile());
    ObjectMapper mapper = new ObjectMapper();
    try {
      mapper.writerWithDefaultPrettyPrinter().writeValue(file, CacheService.getUserMap().values());
    } catch (IOException e) {
      log.error("Error saving library", e);
    }
  }

  public Collection<User> getUsers() {
    return CacheService.getUserMap().values();
  }

  public User getUser(String username) {
    return CacheService.getUserMap().get(username);
  }

  public boolean createUser(User user) {
    if (CacheService.getUserMap().containsKey(user.getUsername())) {
      return false;
    }
    CacheService.getUserMap().put(user.getUsername(), user);
    saveUsers();
    return true;
  }

  public boolean updateUser(User user) {
    if (!CacheService.getUserMap().containsKey(user.getUsername())) {
      return false;
    }
    CacheService.getUserMap().put(user.getUsername(), user);
    saveUsers();
    return true;
  }

  public boolean deleteUser(User user) {
    if (!CacheService.getUserMap().containsKey(user.getUsername())) {
      return false;
    }
    CacheService.getUserMap().remove(user.getUsername());
    saveUsers();
    return true;
  }

  public User setTheme(User user, String theme) {
    user.setTheme(theme);
    CacheService.getUserMap().put(user.getUsername(), user);
    saveUsers();
    return user;
  }
}

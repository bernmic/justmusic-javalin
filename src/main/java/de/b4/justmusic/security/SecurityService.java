package de.b4.justmusic.security;

import de.b4.justmusic.Application;
import de.b4.justmusic.entity.User;
import de.b4.justmusic.service.UserService;
import io.javalin.HaltException;
import io.javalin.Handler;
import io.javalin.security.Role;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class SecurityService {
  private static Logger log = LoggerFactory.getLogger(SecurityService.class);

  public final static String KEY_ALGORYTHM = "HmacSHA512";
  public final static String KEY_DATA = "C285122ED03FC96FC2F79F2F0E7CD12BEE37EE13C0BC7E1C4472C36C4FDE5A79967F9609331D43CBA3D5CA6DDEC942A9DA6844E51AAD4C9C77A6475409453E9D";
  public final static Key KEY = new SecretKeySpec(hexStringToByteArray(KEY_DATA), KEY_ALGORYTHM);
  public final static int TOKEN_TIMEOUT = 1000 * 60 * 60;

  public enum TestRole implements Role {
    ANYONE, ROLE_USER, ROLE_ADMIN, ROLE_GUEST;
  }

  private static SecurityService securityService;

  private SecurityService() {}

  public static SecurityService getInstance() {
    if (securityService == null) {
      securityService = new SecurityService();
    }
    return securityService;
  }

  public static Handler login = ctx -> {
    String username = ctx.basicAuthCredentials() != null ? ctx.basicAuthCredentials().getUsername() : "";
    String password = ctx.basicAuthCredentials() != null ? ctx.basicAuthCredentials().getPassword() : "";

    User user = UserService.getUserService().getUser(username);
    if (user != null && user.getPassword().equals(password)) {
      Date expiration = new Date();
      expiration.setTime(expiration.getTime() + TOKEN_TIMEOUT);
      String compactJws = Jwts.builder()
              .setSubject(username)
              .setIssuedAt(new Date())
              .setExpiration(expiration)
              .signWith(SignatureAlgorithm.HS512, KEY)
              .compact();
      Map<String, Object> result = new HashMap<>();
      result.put("token", compactJws);
      ctx.json(result);
    }
    else {
      ctx.status(401);
    }
  };

  public static Handler checkToken = ctx -> {
    log.info(ctx.path());
    String token = ctx.header("Authorization");
    if (token == null || !token.startsWith("Bearer ")) {
      throw new HaltException(401);
    }
    try {
      Claims claims = Jwts.parser().setSigningKey(KEY).parseClaimsJws(token.substring("Bearer ".length())).getBody();
      String user = claims.getSubject();
      if (!"user".equals(user)) {
        throw new HaltException(401, "Access denied");
      }
    } catch (ExpiredJwtException e) {
      throw new HaltException(401, "Token expired");
    } catch (UnsupportedJwtException e) {
      throw new HaltException(401);
    } catch (MalformedJwtException e) {
      throw new HaltException(401);
    } catch (SignatureException e) {
      throw new HaltException(401);
    } catch (IllegalArgumentException e) {
      throw new HaltException(401);
    }
  };

  private final static char[] hexArray = "0123456789ABCDEF".toCharArray();
  public static String byteArrayToHexString(byte[] bytes) {
    char[] hexChars = new char[bytes.length * 2];
    for ( int j = 0; j < bytes.length; j++ ) {
      int v = bytes[j] & 0xFF;
      hexChars[j * 2] = hexArray[v >>> 4];
      hexChars[j * 2 + 1] = hexArray[v & 0x0F];
    }
    return new String(hexChars);
  }

  public static byte[] hexStringToByteArray(String s) {
    int len = s.length();
    byte[] data = new byte[len / 2];
    for (int i = 0; i < len; i += 2) {
      data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
              + Character.digit(s.charAt(i+1), 16));
    }
    return data;
  }
}

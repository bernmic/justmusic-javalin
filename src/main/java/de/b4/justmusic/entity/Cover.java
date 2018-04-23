package de.b4.justmusic.entity;

public class Cover {
  private final String mimetype;
  private final byte[] image;

  public Cover(String mimetype, byte[] image) {
    this.mimetype = mimetype;
    this.image = image;
  }

  public String getMimetype() {
    return mimetype;
  }

  public byte[] getImage() {
    return image;
  }
}

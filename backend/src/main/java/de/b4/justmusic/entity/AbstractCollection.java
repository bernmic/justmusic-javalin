package de.b4.justmusic.entity;

import java.io.Serializable;

public class AbstractCollection implements Serializable {

  private Paging paging;

  public Paging getPaging() {
    return paging;
  }

  public void setPaging(Paging paging) {
    this.paging = paging;
  }

  public static class Paging implements Serializable {
    private int page;
    private int size;
    private String sort;
    private String direction;

    public Paging() {
      page = 1;
      size = Integer.MAX_VALUE;
      sort = null;
      direction = null;
    }

    public int getPage() {
      return page;
    }

    public void setPage(int page) {
      this.page = page;
    }

    public int getSize() {
      return size;
    }

    public void setSize(int size) {
      this.size = size;
    }

    public String getSort() {
      return sort;
    }

    public void setSort(String sort) {
      this.sort = sort;
    }

    public String getDirection() {
      return direction;
    }

    public void setDirection(String direction) {
      this.direction = direction;
    }
  }
}

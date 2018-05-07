package de.b4.justmusic.controller;

import de.b4.justmusic.entity.AbstractCollection.Paging;

import java.util.Map;

public class AbstractController {
  protected static Paging createPagingObject(Map<String,String[]> queryMap) {
    if (queryMap == null || queryMap.size() == 0) {
      return null;
    }
    Paging paging = new Paging();
    String[] sort = queryMap.get("sort");
    String[] dir = queryMap.get("dir");
    String[] page = queryMap.get("page");
    String[] size = queryMap.get("size");
    if (sort != null && sort.length > 0) {
      paging.setSort(sort[0]);
      paging.setDirection((dir != null && dir.length > 0) ? dir[0] : "asc");
    }
    paging.setPage((page != null && page.length > 0) ? Integer.parseInt(page[0]) : 1);
    paging.setSize((size != null && size.length > 0) ? Integer.parseInt(size[0]) : ((page != null && page.length > 0) ? 20 : Integer.MAX_VALUE));
    return paging;
  }
}

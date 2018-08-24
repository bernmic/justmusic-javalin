package de.b4.justmusic.controller;

import de.b4.justmusic.entity.AbstractCollection.Paging;

import java.util.List;
import java.util.Map;

public class AbstractController {
  protected static Paging createPagingObject(Map<String, List<String>> queryMap) {
    if (queryMap == null || queryMap.size() == 0) {
      return null;
    }
    Paging paging = new Paging();
    List<String> sort = queryMap.get("sort");
    List<String> dir = queryMap.get("dir");
    List<String> page = queryMap.get("page");
    List<String> size = queryMap.get("size");
    if (sort != null && sort.size() > 0) {
      paging.setSort(sort.get(0));
      paging.setDirection((dir != null && dir.size() > 0) ? dir.get(0) : "asc");
    }
    paging.setPage((page != null && page.size() > 0) ? Integer.parseInt(page.get(0)) : 1);
    paging.setSize((size != null && size.size() > 0) ? Integer.parseInt(size.get(0)) : ((page != null && page.size() > 0) ? 20 : Integer.MAX_VALUE));
    return paging;
  }
}

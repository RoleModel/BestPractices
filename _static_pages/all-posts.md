---
layout: page
title: All Posts
icon: feed
permalink: /all-posts/
---

{%- if site.posts.size > 0 -%}
  <div class='list'>
    {%- for post in site.posts -%}
    {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
    <a href="{{ post.url | relative_url }}" class='list-item'>
      <div class='list-item__content'>
        <div class='list-item-title'>{{ post.title | escape }}</div>
        <div class='list-item-subtitle'>{{ post.date | date: date_format }}</div>
      </div>
      {%- if site.show_excerpts -%}
      {{ post.excerpt }}
      {%- endif -%}
      <div class='btn-secondary btn--icon btn--small'>
        <span class='material-symbols-outlined'>navigate_next</span>
      </div>
    </a>
    {%- endfor -%}
  </div>

  <p class="rss-subscribe">subscribe <a href="{{ " /feed.xml" | relative_url }}">via RSS</a></p>
{%- endif -%}

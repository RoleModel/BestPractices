---
layout: page
title: Git
icon: code
permalink: /git/
---

<div class='list'>
  {% assign posts_by_order = site.categories.git | sort: 'order' %}
  {% for post in posts_by_order %}
    <a href="{{ post.url }}" class='list-item'>
      <div class='list-item__content'>
        <div class='list-item-title'>{{ forloop.index0 }}. {{ post.title }}</div>
      </div>
      <div class='btn-secondary btn--icon btn--small'>
        <span class='material-symbols-outlined'>navigate_next</span>
      </div>
    </a>
  {% endfor %}
</div>

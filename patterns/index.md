---
layout: page
title: Patterns
icon: texture
permalink: /patterns/
topic: true
---

<div class='list'>
  {% assign posts_by_order = site.categories.patterns | sort: 'order' %}
  {% for post in posts_by_order %}
    <a href="{{ post.url }}" class='list-item'>
      <div class='list-item__content'>
        <div class='list-item-title'>{{ forloop.index }}. {{ post.title }}</div>
      </div>
      <div class='btn-secondary btn--icon btn--small'>
        <span class='material-symbols-outlined'>navigate_next</span>
      </div>
    </a>
  {% endfor %}
</div>

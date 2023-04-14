---
layout: page
title: Testing
icon: bug_report
permalink: /testing/
---

<div class='list'>
  {% assign posts_by_order = site.categories.testing | sort: 'order' %}
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

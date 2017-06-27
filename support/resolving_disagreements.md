## [Home](../README.md)

## Resolving Disagreements

When pairing or working together on project there will arise times at which teammates disagree about the direction to take. Ultimately the Tech Lead has the final say on design and implementations.

As an effort to involve teammates in productive conversation about disagreements consider using "counting system" such as the one described in paper below, _When Pairs Disagree, 1-2-3_.

# When Pairs Disagree, 1-2-3

Roy W. Miller
Software Developer
RoleModel Software, Inc.

### ABSTRACT

Pair programming requires two programmers work together to solve the same problem. These programmers probably have opinions about most design decisions (method names, and anything else that comes up during a pairing session). Some of those opinions are stronger than others. It is quite likely that those opinions will differ, sometimes often. When they do, there needs to be a simple way to resolve the conflict. Arguing doesn’t work, and helps no one.

When a disagreement about how to proceed comes up, each pair should score his opinion on a scale of 1-3. The highest score dictates what the pair does next. In the event of a tie, the pair should discuss the various options, agree to disagree, pick one, and move on. This simple approach works.

### Keywords

Pair programming, conflict resolution, design.

### 1 THE PROBLEM

Suppose you are using pair programming on your development project. You and your pair are coding along, writing tests first, etc. At some point, you reach a design decision, perhaps a major one. Before barreling ahead, you discuss the decision you have to make, the options each person can think of off the top of his head, and some pros and cons of each. After a few minutes of discussion, you reach the point where you need to decide how to proceed. Each person gives his opinion. Suppose those opinions are different, even diametrically opposed. What do you do? You have three options:

1. Give up, dissolve the pair, and refuse to move forward on the project.
2. Argue until one half of the pair gives up.
3. Discuss the options, agree to disagree for the time being, pick one of the options for how to proceed, and move on.

The first option kills a project, one pair at a time. The second option wastes valuable time that could be spent making progress and learning. The third option is best, but how do you pick an option for how to proceed if you and your pair disagree about what to do next?

This situation occurs every day on my projects. I doubt yours are different. Fortunately for my own pairing sanity, I stumbled upon an answer to the question that works in every case I’ve come across.

### 2 SCORING OPINIONS

One Saturday afternoon, a colleague and I were pair programming at his house. We disagreed about some design point, and we reached an impasse. He told me a story about how he and another fellow on a previous project had ranked their opinions on a scale of one to 10. A rank of one meant, "If treed by a bear and forced to give an opinion, I’d say thus and so, but I really don’t care one way or the other." A rank of 10 meant, "I believe this strongly, and I’ll quit if I don’t get my way."

I liked the sound of this, but thought the scale was unnecessarily complex (how was a rank of seven different from a rank of eight, for example). So I proposed a simpler approach I thought would work. It had five steps:

1. Make sure you understand both opinions first.
2. Rank your opinion on a scale of one to three (1 = "I don’t really care", 2 = "I care enough to spend some time discussing it to hear your point of view and figure out the best option - I need more convincing before I’ll change my mind", 3 = "I’ll quit if I don’t get my way").
3. In order to learn, proceed with the option represented by the highest-ranking opinion.
4. In the event of a tie, handle it in the way that makes the most sense (see the next section, Handling Ties).
5. If there still isn’t a clear path (e.g., the third party comes up with a new option and it’s worse, or the third party is torn and can’t pick an option), either flip a coin to pick one of two original options, or try both and see which works better.

When ranking opinions, threes should be rare. In fact, I can remember only one, and it had nothing to do with code. Typically, the highest anyone goes is a two, and most often the other half of the pair is a one on that particular point.

### 3 HANDLING TIES

Take a closer look at step four in the previous section. You can have a tie at any number (1-1, 2-2, or 3-3). In a recent impromptu retrospective with a colleague, we realized that most of our ties have been at one. We have had a few at two. We have never had a tie at three. How should you handle ties at each level?

### Ties at One

If neither member of a pair really cares that much about his opinion, simply pick one and move on. Flip a coin, or alternate whose opinion you pick. Discuss what you need to discuss to see if you can reach consensus, but don’t waste time arguing over trifles.

Generally, pick the simplest approach that could possibly work and go with it.

### Ties at Two

Ties at two are worth a little more attention.

If each member of a pair cares about his opinion and wants to discuss it, do that. I have spent a half-hour to an hour discussing a 2-2 tie. It is worth the time to avoid running roughshod over your pair’s opinion, or yours. Design shouldn’t take too much time – remember to "ask the code" after a reasonable amount [1] – but it does take some.

I have used a couple approaches to try to reach consensus on a 2-2 tie. Sometimes a pair can agree after simply discussing the pros and cons of each opinion. Sometimes each member holds his opinion just as strongly after talking about the alternatives. In that case, the pair has to make a choice. Typically, my pairs have

1. Asked a third party to render an opinion. If it agrees with one of the opinions expressed by the pair, we have proceeded with that option. If it’s different, and better, we have proceeded with the new option.
2. Engaged in a interesting activity we call "flip-flop." Each member of the pair pretends he holds the other member’s opinion, and argues as vigorously as he can for it.
3. Explore each opinion by coding a little, and let the code tell you which option is "best" for the current situation [2].

The second option takes more energy, usually requires more time, and assumes a healthy dose of humility. But it is amazing how arguing for another’s opinion can help you see flaws in your own, or understand the other better.

The third option isn’t an official XP practice, but it happens often. Note, however, that it is a skill to determine the smallest amount of exploration necessary to demonstrate which approach is better. Don’t assume you have to write code to explore all of the options all of the time, but doing this well takes practice, so don’t be afraid to try it.

I have never had a tie at two go unresolved after using one or more of these tools.

### Ties at Three

Ties at three are serious. If each member of a pair has an extremely strong opinion, and those opinions differ, that pair may have a problem. In this case, maybe one member has a pride issue that he has to resolve. Or maybe this is a "false tie" (more on this below).

If the disagreement is that "simple," there may be hope. If not (e.g., both opinions are very strong, both are very good, and nobody is screaming yet), to be brutally frank I’m not sure what to do. I would recommend using the tools for a 2-2 tie to see if they can help. If they can’t, the team may need to have a group conversation about whether it makes sense to proceed with both members of the pair on board.

### False Ties

I alluded to "false ties" above. This is the case where each member of the pair scores his opinion the same, but there really is no conflict.

There are two cases of "false ties" that I have seen:

1. Both members of the pair are saying the same thing, but aren’t understanding each other because they’re not really communicating
2. Each member of the pair is overlooking a third, better option on which they both can agree easily

When two people are expressing opinions and arguing for or against, they need to be particularly careful not to stop communicating. Remember, the goal is to solve the same problem, not to "win" the argument.

I have been in several situations where my pair and I were so caught up in arguing for our own opinions that we missed a third way. Again, an easy trap to fall into. Seeing that third way isn’t always easy.

Take a step back to evaluate both opinions rather than arguing about them. Ask yourself, "Are we missing something?" The answer may surprise you.

### 4 THE NATURAL POINT FOR NUMBERS

Recall the scenario I laid out at the beginning of the paper. You and your pair reach a design decision, talk about how to proceed, and reach a point where you need to choose a path. Assume you like the 1-2-3 approach and have decided to use it. How do you know when to rank your opinions?

Sometimes, it’s natural for a member of a pair to score his opinion immediately and tell his pair. This is especially true when your opinion is a one for you. Rather than wasting time discussing options for something that you don’t care about, you can let your pair know you don’t care by saying, "We could do this, but it’s a one for me."

Most of the time, it will be natural for each member of a pair to tell the other what his opinion score is after some discussion. In my pairing sessions, we tend to talk for a while first, then we get tired of talking and somebody blurts out a score for his opinion. The other person does the same, and we see if we have a tie or a clear path to proceed.

When to score shouldn’t be too formal. There shouldn’t be "rules" about it. Listen first, try to understand other viewpoints, then score your opinions when it feels right. If there needs to be more discussion, take the time.

### 5 A COUNTING EXAMPLE

Suppose two people are pairing, and they reach a point where they disagree about a particular design decision. They are building a class that seems like it should implement a given behavior, but it just doesn’t feel right. One member of the pair (call him Bob) suggests simply adding a method to the given class for the time being. The other half of the pair (call him Jack) thinks creating a brand new helper class is the wiser move.

Time to discuss. Bob and Jack discuss the alternatives. There is no attacking or evaluation going on here – this is brainstorming. They try to understand the other person’s opinion, and to develop each of the alternatives to its strongest point.

Time to score opinions. Bob thinks creating the new class is premature – he doesn’t think the pair has the insight to know they need that class yet. He says, "Simply adding another method to the existing class is a two for me." Jack sees his point. He hadn’t really thought the new class would be a premature abstraction. He gives his opinion a one. Bob’s opinion wins. The pair proceeds with adding the method.

Suppose, though, that things hadn’t gone this way. Suppose Jack comes up with a pretty darn good argument for the new class, and he says, "Creating a new helper class is a 2 for me." We have a tie. They ask Frank if he has a minute to render an objective, third-party opinion. They describe the situation to him and give him a chance to suggest an option they haven’t thought of. He doesn’t think of something new, but agrees with Bob that adding another method makes sense. Bob’s opinion wins. The pair proceeds with adding the method.

Perhaps "wins" is the wrong word to use here. Bob and Jack aren’t competing in some sort of computer science beauty contest. They are learning together and have reached a fork in the road. They need to pick a path as efficiently as possible. Sometimes Bob’s recommendation will be the one they choose. Sometimes they’ll choose Jack’s. Sometimes they’ll agree. In all cases, making progress and learning is the most important point.

### 6 THE BENEFIT OF COUNTING

A key goal of XP is allowing the team to move at maximum speed all the time. This doesn’t mean the team should ignore important decisions, or implement designs without thinking. It does mean that pairs should not waste time on squabbles that interfere with making progress. Disagreement on a project is inevitable. Project stagnation and death don’t have to be.

The team is learning constantly. The best way to learn is to do and to pay attention while you do. The best way to do when there is more than one option for how to proceed is to discuss the options just enough to make the smartest choice you know how to make, then get going. Adjust as you learn. Resolving disagreement efficiently is the best way to keep moving. Using the 1-2-3 approach is the most efficient approach I’ve ever seen:

1. It lets a pair surmount an impasse. If there is disagreement on how to proceed, scoring opinions helps you keep moving after thoughtfully considering what other people think ("It was a two for me, but I see your point – your approach seems better. Let’s go with it.").
2. It gives a pair (and a team) a shorthand for expressing opinions. This is a common language and a shared understanding ("That’s a two for me. What do you think?").
3. It defuses conflict by allowing each member of a pair to throw out ideas without seeming to contradict his pair all the time ("It’s a one – I’m just brainstorming here.").

I have seen this approach work for everything from picking a method name to choosing which path to take for implementing an entire user story. In one trivial case, it even worked in helping the team decide where to go to lunch. You don’t need to carry it that far.

### 7 CONCLUSION

Pair programming is an extremely difficult thing for human beings [3]. It can be even more difficult when both developers are good at what they do. Strong opinions are unavoidable. Fortunately, if two people are interested at all in pairing, they probably also share the goal of solving a problem together. If that is true, there is hope they can rise above their natural tendencies to argue about their opinions, and try to communicate. The question is how to do that simply and effectively.

If the famed "pair programming mind meld" happens, two programmers could share a brain. In all other cases, having a simple approach to resolve conflict is essential. Scoring opinions is the simplest approach I’ve seen that could possibly work.

### ACKNOWLEDGEMENTS

Thanks to Duff O’Melia for being a good pair, and for describing his original "counting experience" with Andy Fekete at Organon Teknika Corporation. Duff helped me refine the idea and put it into practice.

### REFERENCES

1. Beck, K. Extreme Programming Explained: Embrace Change, Addison-Wesley (1999). Kent doesn’t use this phrase exactly, but he discusses the concept in detail on pp. 112-113.
2. Jeffries, R. et al. Extreme Programming Installed, Addison-Wesley (2000). Ron Jeffries, Ann Anderson, and Chet Hendrickson discuss this concept on page 70, as well as the idea that you should explore alternatives with code for "a few minutes."
3. Auer, K. and R. Miller. Extreme Programming Applied: Playing to Win, Addison-Wesley (2001). We talked about the challenges of pairing at length in chapter 14.

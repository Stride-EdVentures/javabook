# Shunting Yard

Here we will learn how to convert an infix mathematical expression to a postfix expression using the Shunting Yard algorithm.  

First, we need to know what a postfix expression and how to evaluate it.

## Postfix

## The Algorithm
The best way to learn the algorithm is by example. Here is a video that animates and explains the steps. No code is shown and students will have to make some inferences. The goal is to be able to predict what will happen.

The video will illustrate the conversion of the following expressions:  
|Infix|Postfix|
|-----|-------|
| `5 + 7 + 2 + 1 - 3 + 2`| `5 7 + 2 + 1 + 3 - 2 +` |
|`(1 + 2) x 3 / (1 * ( 4 / 2 ) )` | `1 2 + 3 x 1 4 2 / * /`|
|`( ( 1 + 2 ) x 3 + 1 ) x 2` |`1 2 + 3 x 1 + 2 x`|
|`( ( ( ( ( 1 + 2 )  x 3 - 1 ) ) ) ) x 2`| `1 2 + 3 x 1 - 2 x`|


<iframe width="560" height="315" src="https://www.youtube.com/embed/O6YKiEHuSfE?si=wdasc1SMkxBF5Nim" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
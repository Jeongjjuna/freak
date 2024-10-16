

## ✔ 코틀린으로 알고리즘 풀이?

그동안 간결한 문법으로 빠르게 풀기위해 파이썬으로 풀이했었다.(당시에 파이썬이 가장 익숙해서 시작했던 것도 있음)

풀이할때 사고력 싸움이기에 어떤 언어로 풀이하든 상관없다고 생각한다

그래서! 앞으로 코틀린으로 한번 풀이해보려고 한다(뜬금 ㅋㅋㅋ)

간단한 이유..👇
> 웹 개발하는데 있어서 코틀린을 사용하기 시작하기도 했고,  
> 파이썬 타입선언이 부족한 점(물론 명시는 할 수 있음..),  
> 그리고 코드가 길어지고 복잡한 문제풀이 과정에서 변수값에 대한 실수를 너무 많이 하는 것 같아서 불변타입이나 null안전성등을 지원해주는 코틀린으로 풀이해볼 까 한다.(+ 코틀린이 지원해주는 간결하고 우아한 문법들도 덤!!)


<br><br><br>

## ✔ java와의 차이
java에서는 JRE를 통해 java.util.*안에 들어있는 기본 클래스를 사용할 수 있게 해준다.
하지만 kotlin에서는 그렇지 못하다.
그래서 빌드할 때 각종 라이브러리를 묶은 array.jar라는 패키지 파일을 함께 생성하여 코틀린 기본 라이브러리를 지원한다.
gradle 환경에서는 알아서 빌드해주기 때문에 기보 라이브러리들을 import하지 않아도 사용할 수 있다.
(gradle 빌드도구를 이용하지 않는다면 직접 array.jar를 생성해서 실행할 수 있도록 별도의 조치를 해야한다.)


<br><br><br>

## ✔ 문제풀이 하면서 유용한 문법을 모아보자(계속 업데이트)

#### 💡 자료형
- 코틀린에서 Int(래퍼)타입은, 자바의 원시형 int를 감싼 형태이다.
- Int는 4바이트 약21억까지 (-2\**31) ~ (2\**31 - 1)
- 추가 범위가 필요하면 Long 타입을 사용하자
```python
print("ㅋㅋㅋㅋㅋㅋㅋㅋ")
```

<br>

#### 💡 함수형 스타일
- java의 stream과 다르게 문법이 간결
- it 지원
- toList()를 붙이지 않아도됨
- 주의점 : ( ) 괄호가 생략된 { } 사용법에 헷갈리지 말자
```kotlin
members
    .filter { it.age = 10 }
    .map { it.name }
    .sorted()
```

<br>

#### 💡 Set, 해시 사용은 어떻게?
- 기본적으로 배열 Array\<String> 을 활용한다.
- 리스트가 필요하면 List\<String> 을 활용하자.
```kotlin
val reportSet: Set<String> = reqport.toSet() // report: Array<String>

val reportLog: MutableMap<String, MutableList<String>> = mutableMapOf() // java.util.LinkedHashMap
```

<br>

#### 💡 Array\<Int>와 IntArray 활용
- Array\<Int>는 자바의 Integer[] 와 같다.
- IntArray는 자바의 int[] 와 같다.
- <속도비교>
    - IntArray 1억개 삽입 : 116밀리초
    - IntArray 1억개 중 찾기 : 25밀리초
    - Array\<Int> 1억개 삽입 : 830밀리초
    - Array\<Int> 1억개 중 찾기 : 45밀리초
```kotlin
val a: Array<Int>

val b: IntArray = a.toIntArray()

val c: Array<Int> = b.toTypedArray()
```

<br>

#### 💡 Array\<Int> 출력
```kotlin
val array: Array<Int> = arrayOf(1, 2, 3, 4, 5)

println(array.joinToString(separator = " "))
```

<br>

#### 💡 정렬
- Array<Int>, IntArray 모두를 반환하는 sort()메서드가 아래와 같이 존재한다.
```kotlin
val a: Array<Int> = arrayOf(1, 2, 3)
val b: IntArray = intArrayOf(4, 5, 6)
val c: List<Int> = mutableListOf(1, 2, 3)


println(a.sortedArray().joinToString(" "))
println(a.sortedArrayDescending().joinToString(" "))

println(b.sortedArray().joinToString(" "))
println(b.sortedArrayDescending().joinToString(" "))

println(c.sorted())
println(c.sortedDescending())
```

<br>

#### 💡 index와 함께 순회하기(ex python의 enumerate)
```kotlin
val a: List<String>

for ((idx, elem) in a.withIndex()) {
    val b = ":"
    println("$idx $b $elem")
}
```

<br>

#### 💡 연결리스트로 그래프 만들기
```kotlin
val graphL: MutableMap<Int, MutableList<Int>> = mutableMapOf()

for (edge in edges) {
    graph.putIfAbsent(edge[0], mutableListOf())
    graph[edge[0]]!!.add(edge[1])
}
```

<br>

#### 💡 큐(Queue) 활용 -> 코틀린에서 제공하는 데크를 활용해볼까?
- addFirst(), addLast(), removeFirst(), removeLast() 등 활용해보자
```kotlin
val deque: ArrayDeque<Int> = ArrayDeque<Int>()
```

<br>

#### 💡 데이터를 담을 수 있는 data클래스를 활용해보자.
- 기존에 파이썬에서 튜플처럼(1, "문자", 0.5) data클래스를 활용하여 큐에 데이터를 넣는식으로 활용가능하다
```kotlin
data class Node(val index: Int, val sheep: Int, val wolves: Int, val nodes: List<Int>)
```

<br>


#### 💡 2차원 배열은 아래처럼 다뤄보자!
```kotlin
val N: Int = board.size
val M: Int = boardp[0].size
val matrix: Array<IntArray> = Array(N + 1) { IntArray(M + 1) }
```

<br>

#### 💡 지연초기화를 써야할 때도 있을 것 같다
- 코틀린에서 val, var모두 초기에 선언을 반드시 해야한다.
- 만약 값이 나중에 들어올 것 같으면 지연초기화를 해보자.
```kotlin
lateinit var board: Array<IntArray>
```

<br><br>
---

#### 💡 ???


<br><br>
---



[참고]
https://product.kyobobook.co.kr/detail/S000209071463

<br><br><br>
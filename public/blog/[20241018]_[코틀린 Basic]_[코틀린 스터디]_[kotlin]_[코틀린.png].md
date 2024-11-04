
> - 코틀린 학습은 "아토믹 코틀린" 책을 읽고 학습한 내용을 정리한 것이다.
> - JVM 바이트코드(.class)로 변환되기 때문에, 자바를 사용했을 때를 생각하면서 학습하자. 


<br><br><br>

# ✔ 1부 프로그램빙 기초 요약

<br><br>

- main() 함수가 프로그램 시작점이다.


<br><br>
## 🌧️ var 와 val
- <mark>val(value)</mark> : 불변(Immutable)
- <mark>var(variable)</mark> : 가변(Mutable)

- Int, Long, Short, Byte, Double, Float, Char, String, Boolean
  - Number(추상클래스)의 하위타입들이다.
  - Number 에서 형변환을 지원한다. ex) toInt(), toFloat()
    - 형변환 시 범위로 인한 오버플로우 주의
- 문자열 비교
  - equals() 뿐만아니라 "abc" == "abc" 도 가능

- top-level 변수
```kotlin
val x = 10

fun main() {
}
```

<br><br>
## 🌧 함수
- 함수 파라미터는 타입추론이 되지 않으므로 명시해줘야 한다.
- 리턴값은 타입추론이 되기 때문에 <mark>함수표현식</mark>으로 사용가능하다.


<br><br>
## 🌧️ if
- <mark>if 문도 표현식</mark>이기 때문에 var, val 에 대입할 수 있다.
  - 표현식으로 사용할 때에는 반드시 else 를 사용해야함.
```kotlin
val result = if (99 < 100) 4 else 42
```


<br><br>
## 🌧️ 문자열 템플릿
- <mark>${}</mark>를 사용해서 내부에 값을 삽입할 수 있다.
- """(삼중따옴표)또한 여러줄에 걸친 문자열을 표현할 때 사용할 수 있다.(Json 형식 표현할 때 편했던 기억이 있다)


<br><br>
## 🌧️ 루프와 범위
- 아래의 코드에서 코틀린은 c 변수를 val 로 정의하고, c의 타입을 Char 로 타입을 추론한다.
  - 변수 c의 타입을 명시적으로 적어줄 수 있지만, 보통 그렇게 하는경우는 없다고 한다.
```kotlin
for (c in "Kotlin") {
  print("${c}")
}

// 문자 범위도 이터레이션 할 수 있다.
for (c in 'a'..'z') {
  print("${c}")
}
```
- <mark>이터레이션</mark> : 어떤 정수 범위를 반복하는 것
- until, downTo 등 실수는 사용할 수 없다.(정수만 가능)
  - .. 은 부동소수점 표현 가능
- 1 until 10 를 코틀린 1.8 이후부터는 ..< 으로 표기할 수 있다.
- step 을 활용해 간격을 조정할 수 있다.


<br><br>
## 🌧️ in 키워드
- for 루프 제어식에 있는 in : 이터레이션
- 그 외에 모든 in : 원소인지 여부 검사
- 0 <= x && x <= 100 과 x in 0..100 의 실행속도는 거의 같다.
- 부동 소수점 범위를 ..으로


<br><br>
## 🌧️ 식과 문
- 코틀린 대붑문의 요소는 "식"이고, 식은 결과값을 반드시 돌려준다.
- 아래의 println()도 식이기 때문에 실제로는 Unit 이라는 타입을 반환한다.
```kotlin
val result = println("test")
println(result)

// 출력
// returns Unit
// kotlin.Unit
```


<br><br><br>
<br><br><br>

# ✔ 2부 객체에 대하여 요약

<br><br>
## 🌧️ 하이브리드 객체-함수형 언어
- 코틀린은 객체-함수형 언어이다.
  - 객체지향 패터다임와 함수형 패러다임 모두를 지원한다.
- 객체는 프로퍼티 + 멤버함수 로 이루어져 있다.


<br><br>
## 🌧️ 클래스 만들기
- val dog = Dog() 처럼 val 로 선언해도 실제 인스턴스 내부 값은 변경될 수 있다.
  - val 은 dog 의 참조를 다른 객체에 재대입하는 것만 막는다.


<br><br>
## 🌧️ 클래스 만들기
- val dog = Dog() 처럼 val 로 선언해도 실제 인스턴스 내부 값은 변경될 수 있다.
  - val 은 dog 의 참조를 다른 객체에 재대입하는 것만 막는다.
- 코틀린의 접근 제어자
  - public, private, protected, internal
- publc, private는 클래스, 프로퍼티, 함수 앞에 붙을 수 있다.
- 클래스, 최상위 함수, 최상위 프로퍼티를 private으로 정의하면 <mark>그 파일 안에서만</mark> 해당 이름을 볼 수 있다.
- internal은 그 정의가 들어있는 모듈 안에서만 사용할 수 있다.


<br><br>
## 🌧️ 리스트
- <mark>읽기전용</mark> : listOf()
- <mark>가변 리스트</mark> : mutableListOf()
- 읽기 전용 리스트는 불변 리스트와는 다르다.
  - 아래와 같은 예시에서 읽기와 가변 변수가 같은 참조를 가질 때, 가변 변수가 변경하면 읽기 전용 변수도 변경된 같은 참조값을 보게 된다. 
  ```kotlin
  val first = mutableListOf(1) // 가변
  val second : List<Int> = first // 읽기전용
  first += 2 // -> second 는 {1, 2} 로 보인다.
  ```
- Set, Map 도 읽기 & 가변 으로 사용한다.


<br><br>
## 🌧️ 가변 인자 목록
- "vararg ints: Int" 는 임의의 개수만큼 같은 타입 인자를 받을 수 있다.
- 함수에서 vararg는 최대 하나만 지정할 수 있다.
- vararg를 가지를 인자에 Array를 넘겨줄 수 있다.
  - Array 는 항상 가변이다.
- 스프레드 연산 * 는 배열에만 적용할 수 있다.


<br><br>
## 🌧️ 프로퍼티 접근자
- 프로퍼티에 게터, 세터를 정의할 수 있다.
- 게터, 세터 안에서는 field 를 사용해 저장된 값에 접근할 수 있다.
- private 으로 프로퍼티를 선언하면 두 접근자 모두 private 이 된다.
  - 프로퍼티에 private 으로 선언하고 게터를 사용해 public 으로 할 수 있다. 






































> - 코틀린 학습은 "아토믹 코틀린" 책을 읽고 학습한 내용을 정리한 것이다.(3장 사용성 부분)
> - JVM 바이트코드(.class)로 변환되기 때문에, 자바를 사용했을 때를 생각하면서 학습하자.


<br><br><br>

# ✔ 1부 프로그램빙 기초 요약

<br><br>
## 🌧️ 확장함수
- 기존 클래스에 기능을 추가하고 싶을 때 사용한다.
  - 기존 클래스는 외부 라이브러리이고, 내가 접근하거나 제어할 수 없기 때문이다.
- 확장할 대상 타입을 <mark>수신 객체 타입(receiver type)</mark> 이라고 한다.
  - this : receiver type 에 속하는 객체를 가르킨다.
  - this 를 생략할 순 있지만, 명시해주는 방식을 사용하는게 좋아보인다.
- 확장함수는 receiver type 의 public 원소에만 접근할 수 있다.
```kotlin
// fun [수신 객체 타입].확장함수() { ... }
fun String.singleQuote() = "'${this}'"
"문자열".singleQuote() // 출력 결과 : '문자열' 

class Book(val title: String)

fun Book.categorize(category: String) = 
    """ title : ${this.title}, category : ${category} """
```


<br><br>
## 🌧️ 네임드 파라미터, 디폴트 파라미터
- 파라미터의 기본값을 설정할 수 있다.
- 생성자에서 프로퍼티 이름을 명시적으로 적어줄 수 있다.
  - Java 의 중첩 생성자와 builder 패턴 같은 부분을 해결할 수 있는 강력한 도구이다.
  - 같은 파라미터 타입이 존재해서 헷갈리는 경우에도 도움을 줄 수 있다.(자세한 내용은 이펙티브 코틀린에 나와있다.)


<br><br>
## 🌧️ 오버로딩
- 똑같은 확장함수와 멤버변수가 존재한다면, 코틀린은 멤버변수를 우선시 한다.
- 오버로딩보다 디폴트 파라미터를 활용하자.
  - 아래의 코드는 오버라이딩 할 필요없이 디폴트 파라미터를 활용할 수 있다.
```kotlin
// 오버로딩
fun f(n: Int) = n + 273
fun f() = f(0)

// 디폴트 파라미터
fun f(n: Int = 0) = n + 273
```


<br><br>
## 🌧️ when 식
- 두가지 이상의 선택지라면, if 식 보다는 when 식을 사용하자.
- when 을 "식" 으로 사용한다면 else 는 필수이고, 반환이 없는 "문"으로 사용한다면 else 는 필수가 아니다.
- when 다음의 ( 중괄호 ) 안에는 "임의의 식" 이 올 수 있다.
- if 문보다는 when 이 유연하므로, when 을 권장한다고 한다.
- Set 과 Set 을 매치시킬 수 도 있다.
```kotlin
when (setOf(first, second)) {
  setOf("red", "blue") -> "purple"
  setOf("red", "yellow") -> "orange"
  setOf("blue", "yellow") -> "green"
  else -> "unknown"
} 
```
- when 은 인자를 취하지 않는 형태도 있다.
```kotlin
return when {
  weight > 40 -> "과체중"
  weight > 60 -> "비만"
  else -> "정상"
} 
```


<br><br>
## 🌧️ enum
- values() 는 Array 를 반환
- enum 안에 처음 정의된 상수에 0 이라는 ordinal 값이 지정된다. 그 다음부터는 순서대로 증가된 ordinal 값이 각 상수에 부여된다.
```kotlin
enum class Level {
  HIGH, MEDIUM, LOW
} 

// 아래의 경우에 세미콜론(;)를 써줘야 한다.
enum class Direction(val notation: String) {
  NORTH("N"), SOUTH("S"), EAST("E"), WEST("W");
} 
```


<br><br>
## 🌧️ data 클래스
- 모든 생성자 파라미터를 var, val 로 지정해야한다.
- toString() 포함
- copy() : 현재 객체의 모든 데이터를 포함하는 새 객체 생성
  - 복사할 때 몇몇 값은 새롭게 지정해줄 수 있다.
- HashMap 이나 HashSet 에 key로 사용할 수 있는 해시 함수를 자동으로 생성해준다.
  - equals(), hashCode()를 함께 사용해야 key를 빠르게 검색하는데, data 클래스가 대신해준다.

  
<br><br>
## 🌧️ 구조 분해 선언
- Pair 와 같은 객체를 반환할 때, 구조 분해로 받을 수 있다.
- data 클래스는 구조 분해를 지원한다.
- 일부가 필요하지 않은 경우 언더바(_)로 표현할 수 있다.
  - 맨 뒤쪽 값들은 생략할 수 도 있다.
- data 클래스 프로퍼티 중간에 새로운 프로퍼티가 생긴다면, 기존에 구조 분해 할당에 문제가 생길 수 있다(주의)
``kotlin
val (a, _, c) = 여러_값이_들어있는_값
``


<br><br>
## 🌧️ 널이 될 수 있는 타입
- ? : 널 가능한 타입
- String 과 String? 는 아예 다른 타입이다.


<br><br>
## 🌧️ 안전한 호출과 엘비스 연산자
- <mark>안전 호출(?.)</mark> - s?.length()
  - 안전 호출을 통해 여러 멤버에 대한 접근을 연쇄시키는 경우, 중간에 어느 하나라도 null 이라면 전체가 null 이 된다.
- <mark>엘비스 연산자(?:)</mark> - s?.length() ?: 5


<br><br>
## 🌧️ 널 아님 단언
- 널 아님 단언(!!)
  - 이건 위험하니 사용하지 말고(NPE 발생), 안전 호출이나 명시적 null 검사를 하자.


<br><br>
## 🌧️ 확장 함수와 널이 될 수 있는 타입
- 어떻게 아래 코드에서 s1은 nullable 인데 안전호출같은 것을 사용하지 않고 isNullOrEmpty()를 호출했을 까?
  - isNullOrEmpty()가 <mark>String? 타입의 확장함수</mark>이기 때문이다.
```kotlin
val s1 : String? = null
s1.isNullOrEmpty()
```
- <i>[참고]</i> : s == null || s.isEmpty() 에서 s가 null 이어도 NPE 발생하지 않음(쇼트 서킷)
- <mark>null 이 될 수 있는 타입을 확장할 때</mark>에는 주의해야 한다.
  - 오히려 널 가능성을 감출 수 있고, 혼란을 야기할 수 도 있다.(그러니까 되도록 널 가능한 타입 확장은 자제하자)

  
<br><br>
## 🌧️ 제네릭스
- 제네릭스 : 파라미터화한 타입을 사용하는 기법들
- 제네릭 : 파라미터화한 타입이나 클래스, 함수를 따로따로 이야기 할 때 제네릭이라고 부름
- < T > 와 같이 타입 파라미터를 사용
```kotlin
class GenericHolder<T>(
  private val value: T
) {
  fun getValue(): T = value
}
```
- 제네릭 말고 유니버설 타입(Any) 를 사용할 수 도 있다.(사용하지 말자)
  - 이 경우에는 Any 를 사용하다 구체타입의 메서드를 호출할 때 제대로 동작하지 않는다.

- 제네릭 함수는 아래와 같이 작성할 수 있다.
```kotlin
// 제네릭 함수
fun <T> identity(arg: T): T = arg

// 제네릭 확장함수
fun <T> List<T>.firstOrNull(): T? = ...
```


<br><br>
## 🌧️ 확장 프로퍼티
- 확장 프로퍼티는 커스텀 게터가 필요하다.
  - 하지만 사용을 자제하고, 기능이 단순하고 가독성이 올라가는 경우에만 권장한다고 한다.
- 스타 프로젝션(*) : List<*>를 사용하면 안에 담긴 원소 타입 정보를 모두 잃어 Any? 에만 대입할 수 있게된다.
```kotlin
val String.indices: IntRange
  get() = 0 until length
```


<br><br>
## 🌧️ break 와 continue
- 코틀린에서는 break, continue 사용이 드물다. 왜냐고?
- <mark>레이블</mark>
  - 자신을 둘러싼 여러 루프의 경계 한 군데로 점프할 수 있다.
  - '[레이블이름]@' 형태로 for 앞에 명시한다.
  - continue@[레이블이름], break@[레이블이름] 를 통해 해당 위치로 점프한다.
- 뒤에서 학습할 함수형 프로그래밍을 활용하면 break, continue 없이 더 깔끔하게 코드를 작성할 수 있다.
```kotlin
outer@ for (i in 1 .. 10) {
  for (j in 1 .. 10) {
    if (i == 5) break@outer
  }
} 
```











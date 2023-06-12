# 测试驱动开发（TDD）

## 1. TDD基本理解  
  
测试驱动开发（TDD）是一种软件开发方法，要求开发者在编写代码之前先编写测试用例，然后编写代码来满足测试用例，最后运行测试用例来验证代码是否正确。测试驱动开发的基本流程如下：  
  
### 1.1 第一步、编写测试用例  
  
在编写代码之前，先根据需求编写测试用例，测试用例应该覆盖所有可能的情况，以确保代码的正确性。  
  
这一步又称之为“红灯”，因为没有实现功能，此时测试用例执行会失败，在IDE里面执行时会报错，报错为红色。  

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-16mKO16ckbPKvppSld.png)
  
### 1.2 第二步、运行测试用例  
  
由于没有编写任何代码来满足这些测试用例，因此这些测试用例将会全部运行失败。  
  
### 1.3 第三步、编写代码  
  
编写代码以满足测试用例，在这个过程中，我们需要编写足够的代码使所有的测试用例通过。  
  
这一步又称之为“绿灯”，在IDE里面执行成功时是绿色的，非常形象。  

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-170VRcSFa8RTMOA12A.png)
  
### 1.4 第四步、运行测试用例  
  
编写代码完成之后，运行测试用例，确保全部用例都通过。如果有任何一个测试用例失败，就需要回到第三步，修改代码，直至所有的用例都通过。  
  
### 1.5 第五步、重构代码  
  
在确保测试用例全部通过之后，可以对代码进行重构，例如将重复的代码抽取成函数或类，消除冗余代码等。  
  
重构的目的是提高代码的可读性、可维护性和可扩展性。重构不改变代码的功能，只是对代码进行优化，因此重构之后的代码必须依旧能通过测试用例。  
  
### 1.6 第六步、运行测试用例  
  
重构之后的代码，也必须保证通过全部的测试用例，否则需要修改至用例通过。  
  
## 2. TDD常见的误区  
  
### 2.1 误区一、单元测试就是TDD  
  
单元测试是TDD的基础，但单元测试并不等同于TDD。  
  
单元测试是一种**测试方法**，它旨在验证代码中的单个组件（例如类或方法）是否按预期工作。  
  
TDD是一种**软件开发方法**，它强调在编写代码之前先编写测试用例（即单元测试用例），并通过不断运行测试用例来指导代码的设计和实现。TDD是基于单元测试的，TDD的编写的测试用例就是单元测试用例。  
  
TDD还强调测试驱动开发过程中的重构阶段，在重构阶段优化代码结构和设计，以提高代码质量和可维护性。单元测试通常不包括重构阶段，因为它们主要关注单元组件的功能性验证。  
  
### 2.2 误区二、误把集成测试当成单元测试  
  
TDD在很多团队推不起来，甚至连单元测试都推不起来，归根到底是大家对TDD和单元测试的理解有误区。很多开发者在编写测试用例时，以为自己编写的是单元测试，但实际上写的却是集成测试的用例，原因就在于不理解单元测试和集成测试的区别。  
  
单元测试是指对软件中的最小可测试单元进行检查和验证的过程，通常是对代码的单个函数或方法进行测试。单元测试的对象是代码中的最小可测试单元，通常是一个函数或方法。单元测试的范围通常局限于单个函数或方法，只关注该函数或方法对输入数据的处理和输出数据的正确性，不涉及到其他函数或方法的影响，也不考虑系统的整体功能。  
  
集成测试是指将单元测试通过的模块组合起来进行测试，以验证它们在一起能否正常协作和运行。集成测试的对象是系统中的组件或模块，通常是多个**已通过单元测试**的模块组合起来进行测试。集成测试可以发现模块之间的兼容问题、数据一致性问题、系统性能问题等。  

在实际开发中，许多开发者只对最顶层的方法写测试用例，例如直接对Controller方法编写测试用例，然后启动容器，读写外部数据库，图省事一股脑把Controller、Service、Dao全测了。  这实际上写的是集成测试的用例，这会造成：  

- 测试用例职责不单一

单元测试用例职责应该单一，即只是验证业务代码的执行逻辑，不确保与外部的集成，集成了外部服务或者中间件的测试用例，都应视为集成测试。
  
- 测试用例粒度过大  
  
只针对顶层的方法编写测试用例（集成测试），忽略了许多过程中的`public`方法，会导致单元测试覆盖率过低，代码质量得不到保障。
  
- 测试用例执行太慢  

由于需要依赖基础设施（连接数据库），会导致测试用例执行得很慢，如果单元测试不能很快执行完成，开发者往往会失去耐心，不会再继续投入到单元测试中。

可以说，执行慢是单元测试和TDD推不起来的非常大的原因。

结论：单元测试必须屏蔽基础设施（外部服务、中间件）的调用，且单元测试仅用于验证业务逻辑是否按预期执行。

> 判断自己写的用例是否是单元测试用例，方法很简单：只需要把开发者电脑的网络关掉，如果能正常在本地执行单元测试，那么基本写的就是单元测试，否则均为集成测试用例。
  
### 2.3 误区三、项目工期紧别写单元测试了

开发者在将代码提交测试时，我们往往要求先自测通过才能提测。那么，自测通过的依据是什么？我认为自测通过的依据是开发者编写的单元测试用例运行通过、且覆盖了所有本次开发相关的所有核心方法。

我们在需求排期时，可以将自测的时间考虑进去，为单元测试争取足够的时间。

越早的单元测试作用越大，我们可以及早发现代码中的错误和缺陷，并及时进行修复，从而提高代码的可靠性和质量，而不是等到提测之后再修复，此时修复的成本更高。

在项目工期紧迫的情况下，更应该坚持写单元测试，这不会影响项目进度。相反，它可以帮助我们提高代码的质量和可靠性，减少错误和缺陷的出现，从而避免了后期因为错误导致的额外成本和延误。

本文介绍了不少提交单元测试运行速度地方法，读者可以将之应用到实际项目中，减少单测对开发时间的影响。

### 2.4 误区四、代码完成后再补单元测试

任何时候写单元测试都是值得鼓励的，都能使我们从单元测试中受益。

代码完成后再写单元测试的做法会导致问题在开发过程中被忽略，并在后期被发现，从而增加了修复问题的成本和风险。

TDD要求先写测试用例再写代码，开发人员应该在编写代码前就开始编写相应的测试用例，并在每次修改代码后运行测试用例以确保代码的正确性。

### 2.5 误区五、对单元测试覆盖率的极端要求

有的团队要求单元测试覆盖率要100%，有的团队则对覆盖率没有要求。

理论上单元测试应该覆盖所有代码和所有的边界条件，在实际中我们还需要考虑投入产出比。

在TDD中，红灯阶段写的测试用例，会覆盖所有相关的`public` 的方法和边界条件；在重构阶段，某些执行逻辑被抽取为`private`方法，我们要求这些`private`方法中只执行操作不再进行边界判断，因此重构后产生的`private`方法我们不需要考虑其单元测试。

#### 2.6 误区六、单元测试只需要运行一次

许多开发人员认为，单元测试只要运行通过，证明自己写的代码满足本次迭代需求就可以了，之后不需要再运行。

实际上，单元测试的生命周期时和项目代码相同的，单元测试不只是运行一次，其影响会持续到项目下线。

每一次上线，都应该全量执行一遍单元测试，确保从前的测试用例都能通过，本次需求开发的代码没有影响到以前的逻辑，这样做能避免很多线上的事故。

一些年代久远的系统，我们对内部逻辑不熟悉时，如何使变更范围可控？答案就是全量执行单元测试用例，假如从前的测试用例执行不通过了，也就意味着我们本次开发影响了线上的逻辑。老系统没有单元测试怎么办？补。幸运的是现在有不少自动生成单元测试的工具，读者可以自行研究。

## 3. TDD技术选型 

### 3.1 单元测试框架

JUnit和TestNG都是非常优秀的Java单元测试框架，任选其中一个都可以完整实践TDD，本文采用JUnit 5。

### 3.2 模拟对象框架

在单元测试中，我们常常需要使用Mock进行模拟对象，以便模拟其行为，使得单元测试可以更容易地编写。

Mock框架有很多，例如`Mockito`、`PowerMock`等，本文采用`Mockito`。

### 3.3 测试覆盖率

本文采用Jacoco作为测试覆盖率检测工具。

Jacoco是一款Java代码覆盖率工具，它可以帮助开发人员在代码编写过程中监测测试用例的覆盖情况，以便更好地了解测试用例的质量和代码的可靠性。Jacoco可以在代码执行期间收集覆盖信息，同时还可以生成报告，以便开发人员能够更好地了解代码的测试覆盖率。

Jacoco还支持在Maven、Gradle等构建工具中使用。开发人员可以通过在pom.xml或build.gradle文件中添加Jacoco插件来集成。

### 3.4 测试报告

测试报告框架有许多，例如Allure，读者可自行研究学习。

## 4. TDD案例实战  

### 4.1 奇怪的计算器

本案例我们将实现一个奇怪的计算器，通过这个案例完整实践TDD的几个步骤。

限于篇幅，Maven pom文件、测试报告生成等配置就不贴出来了，请读者自行到本案例代码`tdd-example/tdd-example-01`中查看。

本案例的代码地址为：

```text
https://github.com/feiniaojin/tdd-example
```

#### 4.1.1 第一次迭代

奇怪的计算器的需求如下：

```text
输入：输入一个int类型的参数
处理逻辑：
	(1)入参大于0，计算其减1的值并返回；
	(2)入参等于0，直接返回0；
	(3)入参小于0，计算其加1的值并返回
```

接下来采用TDD进行开发。

- 第一步、红灯

编写测试用例，实现上文的需求，注意有三个边界条件，要覆盖完整。

```java
public class StrangeCalculatorTest {  
	
	private StrangeCalculator strangeCalculator;  
	  
	  
	@BeforeEach  
	public void setup() {  
		strangeCalculator = new StrangeCalculator();  
	}  
	  
	@Test  
	@DisplayName("入参大于0，将其减1并返回")  
	public void givenGreaterThan0() {  
		//大于0的入参  
		int input = 1;  
		int expected = 0;  
		//实际计算  
		int result = strangeCalculator.calculate(input);  
		//断言确认是否减1  
		Assertions.assertEquals(expected, result);  
	}  
	  
	@Test  
	@DisplayName("入参小于0，将其加1并返回")  
	public void givenLessThan0() {  
		//小于0的入参  
		int input = -1;  
		int expected = 0;  
		//实际计算  
		int result = strangeCalculator.calculate(input);  
		//断言确认是否减1  
		Assertions.assertEquals(expected, result);  
	}  
	  
	@Test  
	@DisplayName("入参等于0，直接返回")  
	public void givenEquals0() {  
		//等于0的入参  
		int input = 0;  
		int expected = 0;  
		  
		//实际计算  
		int result = strangeCalculator.calculate(input);  
		//断言确认是否等于0  
		Assertions.assertEquals(expected, result);  
	}  
}
```

> 此时StrangeCalculator类和calculate方法还没有创建，会IDE报红色提醒是正常的。

创建`StrangeCalculator`类和`calculate`方法，注意此时未实现业务逻辑，应当使测试用例不能通过，在此抛出一个`UnsupportedOperationException`异常。

```java
public class StrangeCalculator {

	public int calculate(int input) {  
		//此时未实现业务逻辑，因此抛一个不支持操作的异常，以便使测试用例不通过
		throw new UnsupportedOperationException();  
	}  
}
```

运行所有的单元测试：

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-15ieKLAWGVZyradPN.png)

此时报告测试不通过：

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-16mKO16ckbPKvppSld.png)

- 第二步、绿灯

首先实现`givenGreaterThan0`这个测试用例对应的逻辑：

```java
public class StrangeCalculator {  
	public int calculate(int input) {  
		//大于0的逻辑  
		if (input > 0) {  
			return input - 1;  
		}  
		//未实现的边界依旧抛出UnsupportedOperationException异常
		throw new UnsupportedOperationException();  
	}  
}
```

注意，我们目前只实现了`input>0`的边界条件，其他的条件我们应该继续抛出异常，以便使其不通过。

运行单元测试，此时有3个测试用例，其中只有两个出错了。

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-27MvZul12yCdTUihbH.png)

继续实现`givenLessThan0`用例对应的逻辑：

```java
public class StrangeCalculator {  
	public int calculate(int input) {  

		if (input > 0) {  
			//大于0的逻辑  
			return input - 1;  
		} else if (input < 0) {
			//小于0的逻辑  
			return input + 1;  
		}  
		//未实现的边界依旧抛出UnsupportedOperationException异常
		throw new UnsupportedOperationException();  
	}  
}
```

运行单元测试，此时有3个测试用例，其中有1个出错：

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-16ayKCyNvQ12avT9es.png)

继续实现`givenEquals0`用例对应的逻辑：

```java
public class StrangeCalculator {  
	public int calculate(int input) {  
		//大于0的逻辑  
		if (input > 0) {  
			return input - 1;  
		} else if (input < 0) {  
			return input + 1;  
		} else {  
			return 0;  
		}  
	}  
}
```

运行单元测试：此时3个测试用例都通过了：

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-170VRcSFa8RTMOA12A.png)

此时，打开`Jacoco`的测试覆盖率报告（`tdd-example`的pom.xml文件中将报告生成的位置配置为`target/jacoco-report`），打开`index.html`。

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-17dTtXIcaH12SCDUmi.png)

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-189mhYO9xTLKavhno.png)

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-18NOkINanYq7GDkFp.png)

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-18sHqVHluw0FRiQif.png)

可以看到，`calculate`所有的边界条件都覆盖到了。

- 第三步、重构

本案例`calculate`中只有简单的计算，在实际开发中，我们进行重构时，可以将具体的业务操作抽取为`private`方法，例如：

```java
public class StrangeCalculator { 

	public int calculate(int input) {  
		//大于0的逻辑  
		if (input > 0) {  
			return doGivenGreaterThan0(input);  
		} else if (input < 0) {  
			return doGivenLessThan0(input);  
		} else {  
			return doGivenEquals0(input);  
		}  
	}  
	
	private int doGivenEquals0(int input) {  
		return 0;  
	}  
	
	private int doGivenLessThan0(int input) {  
		return input + 1;  
	}  
	
	private int doGivenGreaterThan0(int input) {  
		return input - 1;  
	}  
}
```

再次执行单元测试，测试通过。

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-19KqZZeSYxfjB73L9.png)

查看Jacoco覆盖率的报告，可以看到每个边界条件都被覆盖到。

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-19TUQKbDtMnQpzu6E.png)

#### 4.1.2 第二次迭代

奇怪的计算器第二次迭代的需求如下：

```text
（1）针对大于0且小于100的input，不再计算其减1的值，而是计算其平方值；
```

第二个版本的需求对上一个迭代的边界条件做了调整，我们需要先根据本次迭代，整理出新的、完整的边界条件：

```text
（1）针对大于0且小于100的input，计算其平方值；
（2）针对大于等于100的input，计算其减去1的值；
（3）针对小于0的input,计算其加1的值；
（4）针对等于0的input,返回0
```

此时，之前的测试用例的入参有可能已经不满足新的边界了，但是我们暂时先不管它，继续TDD的“红灯-绿灯-重构”的流程。

- 第一步，红灯

在`StrangeCalculatorTest`中编写新的单元测试用例，用来覆盖本次的两个边界条件。

```java
@Test  
@DisplayName("入参大于0且小于100，计算其平方")  
public void givenGreaterThan0AndLessThan100() {  

	int input = 3;  
	int expected = 9;  
	//实际计算  
	int result = strangeCalculator.calculate(input);  
	//断言确认是否计算了平方  
	Assertions.assertEquals(expected, result);  
}  
  
@Test  
@DisplayName("入参大于等于100，计算其减1的值")  
public void givenGreaterThanOrEquals100() {  
	int input = 100;  
	int expected = 99;  
	//实际计算  
	int result = strangeCalculator.calculate(input);  
	//断言确认是否计算了平方  
	Assertions.assertEquals(expected, result);  
}
```

运行所有单元测试，可以看到有测试用例没有通过：

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-19vYBoslBFTmEOtX6.png)

- 第二步、绿灯

实现第二次迭代的业务逻辑：

```java
public class StrangeCalculator {

	public int calculate(int input) {  
	  
		if (input >= 100) {  
			//第二次迭代时，大于等于100的区间还是走老逻辑  
			return doGivenGreaterThan0(input);  
		} else if (input > 0) {  
			//第二次迭代的业务逻辑  
			return input * input;  
		} else if (input < 0) {  
			return doGivenLessThan0(input);  
		} else {  
			return doGivenEquals0(input);  
		}  
	}  
	  
	private int doGivenEquals0(int input) {  
		return 0;  
	}  
	  
	private int doGivenLessThan0(int input) {  
		return input + 1;  
	}  
	  
	private int doGivenGreaterThan0(int input) {  
		return input - 1;  
	}  
}
```

执行所有的测试用例，此时第二次迭代的`givenGreaterThan0AndLessThan100`和`givenGreaterThanOrEquals100`这两个用例都通过了，但是`givenGreaterThan0`却没有通过：

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-206CBarqgnyRRdycC.png)

这是为什么呢？这是因为边界条件发生了改变，`givenGreaterThan0`用例中的参数input=1，对应的是0<input<100的边界条件，此时已经调整了，`0<input<100`需要计算input的平方，而不是input-1。

我们审查之前迭代的单元测试用例，可以看到`givenGreaterThan0`的边界已经被`givenGreaterThan0AndLessThan100`和`givenGreaterThanOrEquals100`覆盖到了。

一方面`givenGreaterThan0`对应的业务逻辑改变了，一方面已经有其他测试用例覆盖了`givenGreaterThan0`的边界条件，因此，我们可以将`givenGreaterThan0`移除了。

```java
@Test  
@DisplayName("入参大于0，将其减1并返回")  
public void givenGreaterThan0() {  
	int input = 1;  
	int expected = 0;  
	int result = strangeCalculator.calculate(input);  
	Assertions.assertEquals(expected, result);  
}

@Test  
@DisplayName("入参大于0且小于100，计算其平方")  
public void givenGreaterThan0AndLessThan100() {  
	//于0且小于100的入参  
	int input = 3;  
	int expected = 9;  
	//实际计算  
	int result = strangeCalculator.calculate(input);  
	//断言确认是否计算了平方  
	Assertions.assertEquals(expected, result);  
}  
  
@Test  
@DisplayName("入参大于等于100，计算其减1的值")  
public void givenGreaterThanOrEquals100() {  
	//于0且小于100的入参  
	int input = 100;  
	int expected = 99;  
	//实际计算  
	int result = strangeCalculator.calculate(input);  
	//断言确认是否计算了平方  
	Assertions.assertEquals(expected, result);  
}
```

将`givenGreaterThan0`移除后，重新执行单元测试：

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-20HQIVaLKY120AYw7t.png)

这次执行通过了，我们也将测试用例维护在最新的业务规则下。

- 第三步、重构

测试用例通过后，我们便可以进行重构了。

首先，抽取`0<input<100`边界内的逻辑，形成私有方法；

其次，`input>=0`边界条件下的`doGivenGreaterThan0`方法，如今已经名不副实，因此重新命名为`doGivenGreaterThanOrEquals100`。

重构后代码如下：

```java
public class StrangeCalculator {  

	public int calculate(int input) {  
	  
		if (input >= 100) {  
			//第二次迭代时，大于等于100的区间还是走老逻辑  
			// return doGivenGreaterThan0(input);  
			return doGivenGreaterThanOrEquals100(input);  
		} else if (input > 0) {
			//第二次迭代的业务逻辑
			return doGivenGreaterThan0AndLessThan100(input);  
		} else if (input < 0) {  
			return doGivenLessThan0(input);  
		} else {  
			return doGivenEquals0(input);  
		}  
	}  
	  
	private int doGivenGreaterThan0AndLessThan100(int input) {  
		return input * input;  
	}  
	  
	private int doGivenEquals0(int input) {  
		return 0;  
	}  
	  
	private int doGivenGreaterThanOrEquals100(int input) {  
		return input + 1;  
	}  
	  
	private int doGivenGreaterThan100(int input) {  
		return input - 1;  
	}  
}
```

#### 4.1.3 第三次迭代

第三次迭代以及之后的迭代，都按照第二次迭代的思路进行开发。

### 4.2  贫血模型三层架构的TDD实战

贫血三层架构的模型是贫血模型，因此只需要对`Controller`、`Service`、`Dao`这三层进行分别探讨即可。

####  4.2.1  Dao层单元测试用例

严格地说，Dao层的测试属于集成测试，因为Dao层的SQL语句其实是写给数据库去执行的，只有真正连接数据库进行集成测试时，我们才能确认是否正常执行。

Dao层的测试，我们希望验证自己写的Mapper方法是否能正常操作，例如某个ResultMap漏了字段、某个`#{}`没有正常赋值。

我们引入内存数据库（如H2数据库），通过集成到应用中的内存数据库模拟外部数据库，确保了单元测试的独立性，也提高了Dao层单元测试的速度，也使我们可以提前做一些测试，尽量提前发现一些问题。

H2内存数据库的配置，详细可以到本文配套的项目案例`tdd-example/tdd-example-02`中查看，案例地址如下：

```text
https://github.com/feiniaojin/tdd-example
```

以下是`mybatis-generator`逆向生成的mapper，我们把它作为Dao层单元测试的例子。一般来说逆向生成的mapper属于可信任代码，所有不会再进行测试，在此仅作案例。

Dao层Mapper的代码如下：

```java
public interface CmsArticleMapper {  
	int deleteByPrimaryKey(Long id);  
	  
	int insert(CmsArticle record);  
	  
	CmsArticle selectByPrimaryKey(Long id);  
	  
	List<CmsArticle> selectAll();  
	  
	int updateByPrimaryKey(CmsArticle record);  
}
```

Dao层Mapper的测试代码如下：

```java
@ExtendWith(SpringExtension.class)  
@SpringBootTest  
@AutoConfigureTestDatabase  
public class CmsArticleMapperTest {  
	  
	@Resource  
	private CmsArticleMapper mapper;  
	  
	@Test  
	public void testInsert() {  
		CmsArticle article = new CmsArticle();  
		article.setId(0L);  
		article.setArticleId("ABC123");  
		article.setContent("content");  
		article.setTitle("title");  
		article.setVersion(1L);  
		article.setModifiedTime(new Date());  
		article.setDeleted(0);  
		article.setPublishState(0);  
		int inserted = mapper.insert(article);  
		Assertions.assertEquals(1, inserted);  
	}  
	  
	@Test  
	public void testUpdateByPrimaryKey() {  
		CmsArticle article = new CmsArticle();  
		article.setId(1L);  
		article.setArticleId("ABC123");  
		article.setContent("content");  
		article.setTitle("title");  
		article.setVersion(1L);  
		article.setModifiedTime(new Date());  
		article.setDeleted(0);  
		article.setPublishState(0);  
		int updated = mapper.updateByPrimaryKey(article);  
		Assertions.assertEquals(1, updated);  
	}  
	  
	@Test  
	public void testSelectByPrimaryKey() {  
		CmsArticle article = mapper.selectByPrimaryKey(2L);  
		Assertions.assertNotNull(article);  
		Assertions.assertNotNull(article.getTitle());  
		Assertions.assertNotNull(article.getContent());  
	}  
}
```

#### 4.2.2 Service层单元测试用例

重点关注的一层，为了确保用例执行的效率以及屏蔽基础设施调用，Service层所有对基础设施的调用都应该Mock掉。

Service层的代码如下：

```java
@Service  
public class ArticleServiceImpl implements ArticleService {  
	  
	@Resource  
	private CmsArticleMapper mapper;  
	  
	@Resource  
	private IdServiceGateway idServiceGateway;  
	  
	@Override  
	public void createDraft(CreateDraftCmd cmd) {  
	  
		CmsArticle article = new CmsArticle();  
		article.setArticleId(idServiceGateway.nextId());  
		article.setContent(cmd.getContent());  
		article.setTitle(cmd.getTitle());  
		article.setPublishState(0);  
		article.setVersion(1L);  
		article.setCreatedTime(new Date());  
		article.setModifiedTime(new Date());  
		article.setDeleted(0);  
		mapper.insert(article);  
	}  
	  
	@Override  
	public CmsArticle getById(Long id) {  
		return mapper.selectByPrimaryKey(id);  
	}  
}
```

Service层的测试代码如下：

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,  
classes = {ArticleServiceImpl.class})  
@ExtendWith(SpringExtension.class)  
public class ArticleServiceImplTest {  
  
	@Resource  
	private ArticleService articleService;  
	  
	@MockBean  
	IdServiceGateway idServiceGateway;  
	  
	@MockBean  
	private CmsArticleMapper cmsArticleMapper;  
	  
	@Test  
	public void testCreateDraft() {  
	  
		Mockito.when(idServiceGateway.nextId()).thenReturn("123");  
		Mockito.when(cmsArticleMapper.insert(Mockito.any())).thenReturn(1);  
		  
		CreateDraftCmd createDraftCmd = new CreateDraftCmd();  
		createDraftCmd.setTitle("test-title");  
		createDraftCmd.setContent("test-content");  
		articleService.createDraft(createDraftCmd);  
		  
		Mockito.verify(idServiceGateway, Mockito.times(1)).nextId();  
		Mockito.verify(cmsArticleMapper, Mockito.times(1)).insert(Mockito.any());  
	}  
	  
	@Test  
	public void testGetById() {  
		CmsArticle article = new CmsArticle();  
		article.setId(1L);  
		article.setTitle("testGetById");  
		Mockito.when(cmsArticleMapper.selectByPrimaryKey(Mockito.any())).thenReturn(article);  
		  
		CmsArticle byId = articleService.getById(1L);  
		  
		Assertions.assertNotNull(byId);  
		Assertions.assertEquals(1L,byId.getId());  
		Assertions.assertEquals("testGetById",byId.getTitle());  
	}
}
```

通过Jacoco的覆盖率报告可以看到Service的逻辑都覆盖到了：

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-20oS53fdpFWtIrMdil.png)

#### 4.2.3 Controller层单元测试用例

非常薄的一层，按照预想是不涉及业务逻辑的，如果只涉及内外模型的转换，因此单元测试可忽略。如果实在想测一下，可以使用`MockMvc`。

Controller的代码如下：

```java
@RestController  
@RequestMapping("/article")  
public class ArticleController {  
	  
	@Resource  
	private ArticleService articleService;  
	  
	@RequestMapping("/createDraft")  
	public void createDraft(@RequestBody CreateDraftCmd cmd) {  
		articleService.createDraft(cmd);  
	}  
	  
	@RequestMapping("/get")  
	public CmsArticle get(Long id) {  
		CmsArticle article = articleService.getById(id);  
		return article;  
	}
}
```

Controller的测试代码如下：

```java
@ExtendWith(SpringExtension.class)  
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK,  
classes = {ArticleController.class})  
@EnableWebMvc  
public class ArticleControllerTest {  
	  
	@Resource  
	WebApplicationContext webApplicationContext;  
	  
	MockMvc mockMvc;  
	  
	@MockBean  
	ArticleService articleService;  
	  
	//初始化mockmvc  
	@BeforeEach  
	void setUp() {  
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();  
	}  
	  
	@Test  
	void testCreateDraft() throws Exception {  
	  
		CreateDraftCmd cmd = new CreateDraftCmd();  
		cmd.setTitle("test-controller-title");  
		cmd.setContent("test-controller-content");  
		  
		ObjectMapper mapper = new ObjectMapper();  
		String valueAsString = mapper.writeValueAsString(cmd);  
		  
		Mockito.doNothing().when(articleService).createDraft(Mockito.any());  
		  
		mockMvc.perform(MockMvcRequestBuilders  
		//访问的URL和参数  
		.post("/article/createDraft")  
		.content(valueAsString)  
		.contentType(MediaType.APPLICATION_JSON))  
		//期望返回的状态码  
		.andExpect(MockMvcResultMatchers.status().isOk())  
		//输出请求和响应结果  
		.andDo(MockMvcResultHandlers.print()).andReturn();  
	}  
	  
	@Test  
	void testGet() throws Exception {  
	  
		CmsArticle article = new CmsArticle();  
		article.setId(1L);  
		article.setTitle("testGetById");  
		  
		Mockito.when(articleService.getById(Mockito.any())).thenReturn(article);  
		  
		mockMvc.perform(MockMvcRequestBuilders  
		//访问的URL和参数  
		.get("/article/get").param("id","1"))  
		//期望返回的状态码  
		.andExpect(MockMvcResultMatchers.status().isOk())
		.andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
		//输出请求和响应结果  
		.andDo(MockMvcResultHandlers.print()).andReturn();  
	}  
}
```

通过Jacoco的覆盖率报告可以看到Controller的逻辑都覆盖到了：

![](https://s3.cn-north-1.jdcloud-oss.com/shendengbucket1/2023-06-12-15-21cNI913EKuhQHLIh0.png)

### 4.3 DDD下的TDD实战

DDD下的TDD实战，我们以《手把手教你落地DDD》一文的案例工程`ddd-example-cms`为例进行讲解，案例代码将实现在该项目中。

`ddd-example-cms`项目地址为：

```text
https://github.com/feiniaojin/ddd-example-cms
```

DDD中各层的测试用例可以参考贫血模型，只做细微调整即可：

Application层的测试用例可以参考`Service层单元测试用例`进行编写；

Infrastructure层的测试用例代码可以参考`Dao层单元测试用例`进行编写；

User Interface层可以参考`Controller层单元测试用例`进行编写；

在此不多加赘述，详细实现可以到案例工程`ddd-example-cms`中查看。

#### 4.3.1 实体的单元测试

实体的单元测试，要考虑两方面：创建实体必须覆盖其业务规则；业务操作必须复合其业务规则。

```java
@Data  
public class ArticleEntity extends AbstractDomainMask {  
	  
	/**  
	* article业务主键  
	*/  
	private ArticleId articleId;  
	  
	/**  
	* 标题  
	*/  
	private ArticleTitle title;  
	  
	/**  
	* 内容  
	*/  
	private ArticleContent content;  
	  
	/**  
	* 发布状态，[0-待发布；1-已发布]  
	*/  
	private Integer publishState;  
	  
	/**  
	* 创建草稿  
	*/  
	public void createDraft() {  
		this.publishState = PublishState.TO_PUBLISH.getCode();  
	}  
	  
	/**  
	* 修改标题  
	*  
	* @param articleTitle  
	*/  
	public void modifyTitle(ArticleTitle articleTitle) {  
		this.title = articleTitle;  
	}  
	  
	/**  
	* 修改正文  
	*  
	* @param articleContent  
	*/  
	public void modifyContent(ArticleContent articleContent) {  
		this.content = articleContent;  
	}  
	
	/**  
	* 发布  
	*/
	public void publishArticle() {  
		this.publishState = PublishState.PUBLISHED.getCode();  
	}  
}
```

测试用例如下：

```java
public class ArticleEntityTest {  
	  
	@Test  
	@DisplayName("创建草稿")  
	public void testCreateDraft() {  
		ArticleEntity entity = new ArticleEntity();  
		entity.setTitle(new ArticleTitle("title"));  
		entity.setContent(new ArticleContent("content12345677890"));  
		entity.createDraft();  
		Assertions.assertEquals(PublishState.TO_PUBLISH.getCode(), entity.getPublishState());  
	}  
	  
	@Test  
	@DisplayName("修改标题")  
	public void testModifyTitle() {  
		ArticleEntity entity = new ArticleEntity();  
		entity.setTitle(new ArticleTitle("title"));  
		entity.setContent(new ArticleContent("content12345677890"));  
		ArticleTitle articleTitle = new ArticleTitle("new-title");  
		entity.modifyTitle(articleTitle);  
		Assertions.assertEquals(articleTitle.getValue(), entity.getTitle().getValue());  
	}  
	  
	@Test  
	@DisplayName("修改正文")  
	public void testModifyContent() {  
		ArticleEntity entity = new ArticleEntity();  
		entity.setTitle(new ArticleTitle("title"));  
		entity.setContent(new ArticleContent("content12345677890"));  
		ArticleContent articleContent = new ArticleContent("new-content12345677890");  
		entity.modifyContent(articleContent);  
		Assertions.assertEquals(articleContent.getValue(), entity.getContent().getValue());  
	}  
	  
	@Test  
	@DisplayName("发布")  
	public void testPublishArticle() {  
		ArticleEntity entity = new ArticleEntity();  
		entity.setTitle(new ArticleTitle("title"));  
		entity.setContent(new ArticleContent("content12345677890"));  
		entity.publishArticle();  
		Assertions.assertEquals(PublishState.PUBLISHED.getCode(), entity.getPublishState());  
	}  
}
```

#### 4.3.2 值对象的单元测试

值对象的单元测试，主要是必须覆盖其业务规则，以`ArticleTitle`这个值对象为例：

```java
public class ArticleTitle implements ValueObject<String> {  
  
	private final String value;  
	  
	  
	public ArticleTitle(String value) {  
		this.check(value);  
		this.value = value;  
	}  
	  
	private void check(String value) {  
		Objects.requireNonNull(value, "标题不能为空");  
		if (value.length() > 64) {  
			throw new IllegalArgumentException("标题过长");  
		}  
	}  
	  
	@Override  
	public String getValue() {  
		return this.value;  
	}  
}
```

其单元测试为：

```java
public class ArticleTitleTest {  
  
	@Test  
	@DisplayName("测试业务规则，ArticleTitle为空抛异常")  
	public void whenGivenNull() {  
		Assertions.assertThrows(NullPointerException.class, () -> {  
			new ArticleTitle(null);  
		});  
	}  
	  
	@Test  
	@DisplayName("测试业务规则，ArticleTitle值长度大于64抛异常")  
	public void whenGivenLengthGreaterThan64() {  
		Assertions.assertThrows(IllegalArgumentException.class, () -> {  
			new ArticleTitle("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");  
		});  
	}  
	  
	@Test  
	@DisplayName("测试业务规则，ArticleTitle小于等于64正常创建")  
	public void whenGivenLengthEquals64() {  
		ArticleTitle articleTitle = new ArticleTitle("1111111111111111111111111111111111111111111111111111111111111111"); 
		Assertions.assertEquals(64, articleTitle.getValue().length());  
	}  
}
```

### 5.3.3 Factory的单元测试

```java
@Component  
public class ArticleDomainFactoryImpl implements ArticleFactory {  
  
@Override  
	public ArticleEntity newInstance(ArticleTitle title, ArticleContent content) {  
		ArticleEntity entity = new ArticleEntity();  
		entity.setTitle(title);  
		entity.setContent(content);  
		entity.setArticleId(new ArticleId(UUID.randomUUID().toString()));  
		entity.setPublishState(PublishState.TO_PUBLISH.getCode());  
		entity.setDeleted(0);  
		Date date = new Date();  
		entity.setCreatedTime(date);  
		entity.setModifiedTime(date);  
		return entity;  
	}  
}
```

我们将Factory实现在Application层，`ArticleDomainFactoryImpl`的测试用例 和Service层的测试用例是非常相似的。测试代码如下：
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE,  
classes = {ArticleDomainFactoryImpl.class})  
@ExtendWith(SpringExtension.class)  
public class ArticleDomainFactoryImplTest {  
	  
	@Resource  
	private ArticleFactory articleFactory;  
	  
	@Test  
	@DisplayName("Factory创建新实体")  
	public void testNewInstance() {  
	  
		ArticleTitle articleTitle = new ArticleTitle("title");  
		ArticleContent articleContent = new ArticleContent("content1234567890");  
		  
		ArticleEntity instance = articleFactory.newInstance(articleTitle, articleContent);  
		
		// 创建新实体
		Assertions.assertNotNull(instance); 
		// 唯一标识正确赋值
		Assertions.assertNotNull(instance.getArticleId()); 
	}  
}
```

<!--@include: ../footer.md-->

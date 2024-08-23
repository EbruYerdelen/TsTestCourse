import { getStringInfo, StringUtils, toUpperCase } from "../app/Utils"

//general structure of a test is three A's,which are arrange act and assert

describe('Utils test suite', () => {

  describe('StringUtils test', () => {
    /*
      When you want to use the same set up and arrange parts for your following tests you can use the beforeEach hook and initialize the setup you need.
      similarly afterEach hook runs a piece after all test units are executed.It's  mostly used for teardown stage and for clearing mocks
      
      also,
      When you declare a variable with let sut: StringUtils, you are only specifying the type of sut without giving it an initial value. This is useful when you want to initialize it later, such as in a beforeEach block.
      The declaration ensures that sut is recognized as a StringUtils type throughout the scope of the test suite, allowing you to initialize it properly before each test case.

      let sut: StringUtils is a variable declaration that tells TypeScript the type of the variable sut but does not initialize it with a value.
      let sut = new StringUtils() initializes the variable sut with an instance of StringUtils.
    */
    
    let sut: StringUtils;
    beforeEach(() => {
      sut = new StringUtils();
      console.log("setup");

    });

    afterEach(() => {
      //clearing mocks
      console.log('teardown');
    })


    it("should return correct UpperCase", () => {
      const actual = sut.toUpperCase("abc");

      expect(actual).toBe("ABC");
      console.log("actual setup");
    });
  })


  describe("StringUtils Error Test", () => {
    let sut: StringUtils;
    beforeEach(() => {
      sut = new StringUtils();
    });

    //for testing errors if they are threw or not,you should wrap your line which is expected to give error in a function,and invoke that function in the assert stage
    it("Should throw error on invalid argument - function", () => {
      function expectError() {
        const actual = sut.toUpperCase("");
      }
      expect(expectError).toThrow("Invalid argument"); //compares if expectError function throws error
    });

    //you can also use an arrow func inside expect,instead of a reference like you did above
    it("Should throw error on invalid argument - arrow function", () => {
      expect(() => {
        sut.toUpperCase("");
      }).toThrow("Invalid argument");
    });

    it("Should throw error on invalid argument - try catch block", (done) => {
      try {
        sut.toUpperCase(""); //code line that should be throwing error,this is the actual value stage which should be an error
        done("GetStringInfo should throw an error for invalid arg");
      } catch (error) {
        //you can make assertions here based on the error thrown by above
        expect(error).toBeInstanceOf(Error); //here we are checking the error object we got from above is an instance of 'Error' object or not
        expect(error).toHaveProperty("message", "Invalid argument");
        done();
      }
    });
    //but this above it,is an incorrect way of testing.Because even when we try that sut.toUpperCase("") line and see it does not throw any error(for ex you can set this situation by removing throw error in uppercase function in actual file),it won't reach to catch block and still pass the test.But we don't want this situation.
    //To solve this,you can use done callback as parameter and use it in try block to make sure that in our test,in the case of string entered in toUpperCase is '' and method itself does not throw an error for this case,that touppercase method itself should throw an error for this case first so that we can provide not passing the whole test with a falsy '' value.
    /*
Flow of the test:

If an error is thrown (expected behavior):

The catch block is executed.
Assertions are made on the error.
The test passes implicitly (no done call needed).


If no error is thrown (unexpected behavior):

done is called with an error message.
This fails the test with the provided message.




Why it ensures the test fails correctly:

Without done, if no error was thrown, the test would pass silently.
Using done this way forces a failure if the expected error doesn't occur.
    */
  })






  it('should return uppercase of a valid string entered', () => {
    //arrange
    const sut = toUpperCase// variable defined as sut is what we are trying to test
    const expected = "ABC" 

    //actual 
    const actual = sut("abc")//this is the actual value and you are trying to see if actual value you get from what you want to test,is equal to the expected value


    //assert
    expect(actual).toBe(expected)//toBe is the most known jest matchers which provides a check if expected and actual variable matches
  })





  //instead of checking for each use case like const expected = "ABC" or "XYZ" etc. we can check each usecase defined in array with a one describing as follows,
    describe("ToUpperCase examples", () => {
      it.each([
        { input: "abc", expected: "ABC" },
        { input: "My-String", expected: "MY-STRING" },
        { input: "def", expected: "DEF" },
      ])("$input toUpperCase should be $expected", ({ input, expected }) => {
        const actual = toUpperCase(input);
        expect(actual).toBe(expected);
      });
    });











  //it.only means it'll run only this test
  //this below approach is nice but it's better to categorize different individual test fields in units.This way it's easier to debug
  it("should return info for valid string", () => {

    const actual = getStringInfo("My-String");


    expect(actual.lowerCase).toBe("my-string");
    expect(actual.extraInfo).toEqual({});//when comparing primitive types you will use toBe but when we compare objects you use toEqual to compare

    expect(actual.characters.length).toBe(9);
    expect(actual.characters).toHaveLength(9);

    expect(actual.characters).toEqual([
      "M",
      "y",
      "-",
      "S",
      "t",
      "r",
      "i",
      "n",
      "g",
    ]);

    expect(actual.characters).toContain<string>("M");//this <string> type passing is better because if you write number inside toContain,typescript will complain and it'll not cause errors in ur app since you realize it this way

    expect(actual.characters).toEqual(
    expect.arrayContaining(["S", "t", "r", "i", "n", "g", "M", "y", "-"])
    );//this way you can still check if it equals to the array above but there is no obligation like it should be the same order as above

    expect(actual.extraInfo).not.toBe(undefined);
    expect(actual.extraInfo).not.toBeUndefined();
    //two above are exactly the same

    expect(actual.extraInfo).toBeDefined();
    expect(actual.extraInfo).toBeTruthy();//this is useful to check if an object is defined or undefined when you are not sure about structure

  })
  





  //each test unit should be independent of each other so it's better to define actual in each unit test
  //now the correct structure for above it test is,
  describe('getStringInfo for arg My-String should', () => {


    test('return right length', () => {
      const actual = getStringInfo('My-String');
      expect(actual.characters).toHaveLength(9);
    });
    test('return right lower case', () => {
      const actual = getStringInfo('My-String');
      expect(actual.lowerCase).toBe('my-string');
    });
    test('return right upper case', () => {
      const actual = getStringInfo('My-String');
      expect(actual.upperCase).toBe('MY-STRING');
    });
    test('return right characters', () => {
      const actual = getStringInfo('My-String');
      expect(actual.characters).toEqual(['M', 'y', '-', 'S', 't', 'r', 'i', 'n', 'g']);
      expect(actual.characters).toContain<string>('M');
      expect(actual.characters).toEqual(
        expect.arrayContaining(['S', 't', 'r', 'i', 'n', 'g', 'M', 'y', '-'])
      );
    });
    test('return defined extra info', () => {
      const actual = getStringInfo('My-String');
      expect(actual.extraInfo).toBeDefined();
    });

    test('return right extra info', () => {
      const actual = getStringInfo('My-String');
      expect(actual.extraInfo).toEqual({})
    });
  })

})


/*

expect(actual.extraInfo).not.toBe(undefined);
expect(actual.extraInfo).not.toBeUndefined();


expect(actual.extraInfo): This part specifies the value that you're making assertions about. Here, actual.extraInfo is the value being tested.

.not: This negates the assertion that follows it. It means that the following condition should not be true.

.toBe(undefined): This matcher checks if actual.extraInfo is strictly equal to undefined. Using toBe performs a strict equality check (===) and expects actual.extraInfo to be exactly undefined.

.toBeUndefined(): This matcher is specifically designed to check if the value is undefined. It is a more readable and expressive way to assert that a value is undefined.


*/
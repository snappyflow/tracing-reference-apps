namespace python Example
service Example{
    // return current time stamp
    string showCurrentTimestamp(1:string a)
     
    // wait for 10 seconds, but work asynchronously
    oneway void asynchronousJob()
}

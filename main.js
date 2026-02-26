// function check( a,  b)
// {
//     let result;
//     result=a+b;
//     return result;
// }


// let addEventListener; a=78;
// let  out=a+15;
// console.log(out);
// b="How's the day?";
// console.log(check(2,5));
// console.log(b);

// // for array 
// const arr=[];

// ver 


// let a=7;
// let store=0; bool okay=true;
// for(let i=2; i<a; i++)
// {
//     if(a%i==0)
//     {
//         store=1; break;
//     }
// }
// if(store==1) console.log("not prime");
// else console.log("prime");

// vector<int>v;
// for(let i=2; i<a; i++)
// {
//     if(a%i==0)
//     {
//         v.push_back(i);
//     }
// }

let a=10;
vector<int>v(a);
for(let i=1; i<a; i++)
{
    for(let j=i; j<a; j+=i)
    {
        v[j]++;
    }
}
vector<let>primes;
for(let i=1; i<a; i++)
{
    if(v[i]==2)
    {
        primes.push_back(i);
    }
}
cout<<primes.size()<<" ";

for(let i=0; i<primes.size(); i++) cout<<primes[i]<<" ";
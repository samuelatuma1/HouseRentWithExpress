
function findSumPair(arr: Array<number>, sumVal: number): [number, number] | boolean{
    let startIdx: number = 0
    let endIdx: number = arr.length - 1
    while(startIdx !== endIdx){
        // Get values at idx Pos
        let startNum: number= arr[startIdx]
        let endNum: number = arr[endIdx]

        let dataSum: number = startNum + endNum
        if (dataSum === sumVal)
            return [startIdx, endIdx]
        
        // If sum is greater, move away from the larger idx
        if (dataSum > sumVal){
            endIdx--
        }
        if(dataSum < sumVal){
            startIdx++
        }
   }
    return false
}
/**
 * @runtime O(n) space-complexity O(n)
 */
function unorderedFindPair(arr: Array<number>, sumVal: number): boolean{
    const compliments: Set<number> = new Set()
    
    for(const num of arr){
        const compliment: number = sumVal - num
        if(compliments.has(compliment)) 
            return true;
        compliments.add(num)
    }
    return false
}

console.log(unorderedFindPair([1, 2, 4, 4], 8))
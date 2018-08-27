export class ArrayStatics {
    static minIndex(array: Array<number>): number {
        let minValue = Infinity;
        let minIndex = -1;

        let index;
        for (index = 0; index < array.length; index++) {
            if (array[index] < minValue) {
                minValue = array[index];
                minIndex = index;
            }
        }
        return minIndex;
    }
}
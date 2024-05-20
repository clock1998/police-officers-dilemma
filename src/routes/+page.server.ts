import { PrismaClient } from '@prisma/client'; 
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
const prisma = new PrismaClient();
export const actions: Actions = {
    create: async ({ request }) => {
        try {
            let formData = await request.formData();
            let reactionTime = Number(formData.get('reactionTime'))
            let isBlack = Boolean(formData.get('isBlack'));
            let isArmed = Boolean(formData.get('isArmed'));
            let isCorrect = Boolean(formData.get('isCorrect'));
            let isSlow = Boolean(formData.get('isSlow'));

            let result = await prisma.testResult.create({
                data: {
                    reactionTime,
                    isBlack,
                    isArmed,
                    isCorrect,
                    isSlow
                }
            })
        } catch (err) {
            console.log(err)
            return fail(500, { message: "Cannot submit test result" })
        }
        return { status: 201 }
    }
}

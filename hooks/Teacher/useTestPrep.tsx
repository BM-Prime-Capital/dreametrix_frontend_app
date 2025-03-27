"use client"

import { useState } from "react"

interface SelectItemModel {
    value: string
    display_name: string
}

export interface testPrepReqDTOModel {
    subject: string
    grade: string
    testType: string
}


export const useTestPrep = () => {
    const [initTestPrepData, setInitTestPrepData] = useState<testPrepReqDTOModel>({
        subject: "",
        grade: "",
        testType: "",
    })


    const [isLoading, setIsLoading] = useState(false)

    // Mockup data for testing purpose
    //Should be replaced with the proper backend call to get subjects
    const subjectsList: SelectItemModel[] = [
        { value: "Math", display_name: "Math" },
        { value: "Science", display_name: "Science" },
        { value: "Art", display_name: "Art" },
        { value: "Psychology", display_name: "Psychology" },
    ]

    // Mockup data for testing purpose
    //Should be replaced with the proper backend call to get grades

    const gradesList: SelectItemModel[] = [
        { value: "Grade 1", display_name: "Grade 1" },
        { value: "Grade 2", display_name: "Grade 2" },
        { value: "Grade 3", display_name: "Grade 3" },

    ]

    // Mockup data for testing purpose
    //Should be replaced with the proper backend call to get test types
    const testTypesList: SelectItemModel[] = [
        { value: "Type 1", display_name: "Type 1" },
        { value: "Type 2", display_name: "Type 2" },
        { value: "Type 3", display_name: "Type 3" },

    ]


    const handleInputChange = (name: string, value: string) => {
        setInitTestPrepData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (initializeTestData:testPrepReqDTOModel) => {

        setIsLoading(true)
        try {

            //Call test Prep API

            console.log("Initialize test data ==>",initializeTestData )

            return {
                statusCode:200,
                message:"You successfully initialized test prep"
            }
        } catch (error) {
            console.error("Error on getting a test prep:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return {
        initTestPrepData,
        isLoading,
        subjectsList,
        gradesList,
        testTypesList,
        handleInputChange,
        handleSubmit,
    }
}


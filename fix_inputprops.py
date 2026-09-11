import os

files_to_fix = [
    "frontend/src/modules/academic/course/presentation/pages/CourseList.page.tsx",
    "frontend/src/modules/academic/cycle/presentation/pages/AcademicCycleList.page.tsx",
    "frontend/src/modules/academic/campus/presentation/pages/CampusList.page.tsx",
    "frontend/src/modules/academic/cohort/presentation/pages/CohortList.page.tsx",
    "frontend/src/modules/academic/program/presentation/pages/AcademicProgramList.page.tsx"
]

for file_path in files_to_fix:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace InputProps with slotProps={{ input: { ... } }}
    # In these files, it looks like:
    # InputProps={{
    #   startAdornment: (
    #     <InputAdornment position="start">
    #       <Search fontSize="small" />
    #     </InputAdornment>
    #   ),
    # }}
    
    content = content.replace("InputProps={{", "slotProps={{\n            input: {")
    content = content.replace("            ),\n          }}", "            ),\n            }\n          }}")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Fixed InputProps")

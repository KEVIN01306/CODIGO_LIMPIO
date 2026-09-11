import os

academic_path = 'backend/src/modules/Academic'

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            full_path = os.path.join(root, file)
            if full_path.endswith('.ts'):
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Fix Audit import
                content = content.replace('../../Audit/application/create-audit-log.usecase.js', '@modules/Audit/application/create-audit-log.usecase.js')
                
                # Fix err type in catch
                content = content.replace('.catch(err =>', '.catch((err: any) =>')

                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(content)

process_directory(academic_path)
print("Audit imports and catch err typed fixed.")
